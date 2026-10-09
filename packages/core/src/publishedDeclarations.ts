import {
  cpSync,
  existsSync,
  readdirSync,
  readFileSync,
  rmSync,
  statSync,
} from "node:fs";
import { builtinModules, createRequire } from "node:module";
import path from "node:path";

/*
 * What a published `.d.ts` may import, and how a private workspace package's
 * declarations get into one.
 *
 * `externalizeDeps({ except })` inlines a private package's JavaScript, but the
 * declarations are a separate step: `unplugin-dts` writes one `.d.ts` per
 * source file and leaves an import of another package as that import. For a
 * package that never reaches npm the consumer's compiler cannot resolve it — a
 * public type turns `any` under `skipLibCheck`, or fails with TS2307 without —
 * and inside the monorepo the workspace symlink resolves it, so nothing here
 * notices. `@mittwald/flow-core` never had the problem only because `src`
 * never imports it.
 */

const bundledDirectory = "_bundled";

/** Matches the specifier of every import form a declaration file uses. */
const specifierPattern =
  /(\bfrom\s+|\bimport\s*\(\s*|\bimport\s+|\bdeclare\s+module\s+)(["'])([^"']+)\2/g;

const referenceTypesPattern = /\/\/\/\s*<reference\s+types=(["'])([^"']+)\1/g;

const referencePathPattern = /\/\/\/\s*<reference\s+path=(["'])([^"']+)\1/g;

const isBare = (specifier: string): boolean =>
  !specifier.startsWith(".") && !path.isAbsolute(specifier);

/** `@scope/name/deep/path` → `@scope/name`, `name/deep` → `name`. */
export const packageNameOf = (specifier: string): string => {
  const segments = specifier.split("/");
  return specifier.startsWith("@")
    ? segments.slice(0, 2).join("/")
    : (segments[0] ?? specifier);
};

/** Every package a declaration file imports. */
export const importedPackagesOf = (content: string): string[] => {
  const specifiers = Array.from(
    content.matchAll(specifierPattern),
    (m) => m[3] ?? "",
  );
  return [...new Set(specifiers.filter(isBare).map(packageNameOf))];
};

/** Every `/// <reference types>` of a declaration file, as written. */
export const referencedTypesOf = (content: string): string[] => [
  ...new Set(
    Array.from(content.matchAll(referenceTypesPattern), (m) => m[2] ?? ""),
  ),
];

/**
 * The packages a `/// <reference types="name" />` can resolve to: `name`
 * itself, or its DefinitelyTyped package (`@scope/name` →
 * `@types/scope__name`).
 */
export const typesPackagesOf = (reference: string): string[] => {
  const name = packageNameOf(reference);
  const typesName = name.startsWith("@")
    ? name.slice(1).replace("/", "__")
    : name;
  return [name, `@types/${typesName}`];
};

const unscoped = (packageName: string): string =>
  packageName.split("/").at(-1) ?? packageName;

/**
 * The declaration file with every import of a bundled package pointed at the
 * copy of its declarations under `<typesDir>/_bundled/<name>`.
 */
export const rewriteBundledImports = (
  content: string,
  filePath: string,
  typesDir: string,
  bundledPackages: readonly string[],
): string =>
  content.replace(specifierPattern, (match, prefix, quote, specifier) => {
    const bundled = bundledPackages.find(
      (name) => specifier === name || specifier.startsWith(`${name}/`),
    );
    if (!bundled) {
      return match;
    }
    const subpath = specifier.slice(bundled.length) || "/index";
    const target = path.join(
      typesDir,
      bundledDirectory,
      unscoped(bundled),
      subpath,
    );
    let relative = path
      .relative(path.dirname(filePath), target)
      .split(path.sep)
      .join("/");
    if (!relative.startsWith(".")) {
      relative = `./${relative}`;
    }
    return `${prefix}${quote}${relative}${quote}`;
  });

interface Manifest {
  name: string;
  types?: string;
  typings?: string;
  exports?: unknown;
  dependencies?: Record<string, string>;
  peerDependencies?: Record<string, string>;
  optionalDependencies?: Record<string, string>;
}

const readManifest = (root: string): Manifest =>
  JSON.parse(readFileSync(path.join(root, "package.json"), "utf8")) as Manifest;

/** Every `types` target in `exports`, plus the top-level `types`/`typings`. */
export const typeEntriesOf = (manifest: Manifest): string[] => {
  const entries = [manifest.types, manifest.typings].filter(
    (entry): entry is string => typeof entry === "string",
  );
  const walk = (value: unknown): void => {
    if (!value || typeof value !== "object") {
      return;
    }
    for (const [key, nested] of Object.entries(value)) {
      if (key === "types" && typeof nested === "string") {
        entries.push(nested);
      } else {
        walk(nested);
      }
    }
  };
  walk(manifest.exports);
  return [...new Set(entries)];
};

const isJavaScript = (target: string): boolean => /\.[cm]?js$/.test(target);

/** Whether an `exports` value reaches JavaScript without a `types` beside it. */
const hasUntypedJavaScript = (value: unknown): boolean => {
  if (typeof value === "string") {
    return isJavaScript(value);
  }
  if (!value || typeof value !== "object") {
    return false;
  }
  if ("types" in value) {
    return false;
  }
  return Object.values(value).some(hasUntypedJavaScript);
};

/**
 * The `exports` subpaths that point at JavaScript without a `types` condition.
 * A consumer importing one gets no declarations for it.
 */
export const untypedExportsOf = (manifest: Manifest): string[] => {
  const { exports } = manifest;
  const isSubpathMap =
    !!exports &&
    typeof exports === "object" &&
    !Array.isArray(exports) &&
    Object.keys(exports).some((key) => key.startsWith("."));
  if (!isSubpathMap) {
    return hasUntypedJavaScript(exports) ? ["."] : [];
  }
  return Object.entries(exports)
    .filter(([, value]) => hasUntypedJavaScript(value))
    .map(([subpath]) => subpath);
};

const filesBelow = (directory: string): string[] =>
  existsSync(directory)
    ? readdirSync(directory, { recursive: true, encoding: "utf8" })
        .map((file) => path.join(directory, file))
        .filter((file) => statSync(file).isFile())
    : [];

/**
 * The files a `types` entry names. A pattern entry (`./dist/types/*.d.ts`)
 * names every file its `*` matches, in subdirectories too, as a subpath pattern
 * in `exports` does.
 */
export const typeEntryFiles = (root: string, entry: string): string[] => {
  const star = entry.indexOf("*");
  if (star === -1) {
    const file = path.resolve(root, entry);
    return existsSync(file) ? [file] : [];
  }
  const head = entry.slice(0, star);
  const prefix = path.resolve(root, head);
  const suffix = entry.slice(star + 1);
  const directory = head.endsWith("/") ? prefix : path.dirname(prefix);
  return filesBelow(directory).filter(
    (file) =>
      file.startsWith(prefix) &&
      file.endsWith(suffix) &&
      file.length > prefix.length + suffix.length,
  );
};

const relativeSpecifiersOf = (content: string): string[] =>
  Array.from(content.matchAll(specifierPattern), (m) => m[3] ?? "").filter(
    (specifier) => specifier.startsWith("."),
  );

const isFile = (file: string): boolean =>
  existsSync(file) && statSync(file).isFile();

/** `x.d.ts`, `x.d.mts`, `x.d.cts`, or `x.d.css.ts` for an arbitrary extension. */
const isDeclarationFile = (file: string): boolean =>
  /\.d\.([cm]?ts|[^./]+\.ts)$/.test(file);

/**
 * The file a relative specifier names for a consumer's compiler: a declaration
 * file — `.d.mts` for `.mjs`, `x.d.css.ts` for `x.css` — or a JSON module.
 */
const resolveDeclaration = (
  fromFile: string,
  specifier: string,
): string | undefined => {
  const base = path.resolve(path.dirname(fromFile), specifier);
  const extension = path.extname(base);
  const stem = base.slice(0, base.length - extension.length);
  const candidates = [
    base,
    base.replace(/\.js$/, ".d.ts"),
    base.replace(/\.mjs$/, ".d.mts"),
    base.replace(/\.cjs$/, ".d.cts"),
    `${base}.d.ts`,
    path.join(base, "index.d.ts"),
    ...(extension === "" ? [] : [`${stem}.d${extension}.ts`]),
  ];
  return candidates.find(
    (candidate) =>
      (isDeclarationFile(candidate) || candidate.endsWith(".json")) &&
      isFile(candidate),
  );
};

/**
 * The declaration files a consumer's compiler can reach — the `types` entries
 * and everything they import relatively or name in a `/// <reference path>` —
 * and every part of that the guard cannot resolve. A file nothing reaches — a
 * story helper, a test augmentation — is dead weight, but it cannot fail
 * anyone's build. What cannot be resolved is a problem: the check would
 * otherwise pass on files it never read.
 */
export const declarationGraphOf = (
  root: string,
): { files: string[]; problems: string[] } => {
  const manifest = readManifest(root);
  const problems = untypedExportsOf(manifest).map(
    (subpath) =>
      `exports["${subpath}"] points at JavaScript without a "types" condition — a consumer gets no declarations for it.`,
  );
  const entries = typeEntriesOf(manifest);
  if (entries.length === 0) {
    problems.push(`package.json names no "types" entry — nothing to check.`);
  }

  const queue: string[] = [];
  for (const entry of entries) {
    const files = typeEntryFiles(root, entry);
    if (files.length === 0) {
      problems.push(`The "types" entry "${entry}" matches no file.`);
    }
    queue.push(...files);
  }

  const seen = new Set<string>();
  for (let file = queue.pop(); file !== undefined; file = queue.pop()) {
    if (seen.has(file) || !isDeclarationFile(file)) {
      continue;
    }
    seen.add(file);
    const content = readFileSync(file, "utf8");
    const from = path.relative(root, file);
    for (const specifier of relativeSpecifiersOf(content)) {
      const next = resolveDeclaration(file, specifier);
      if (next === undefined) {
        problems.push(
          `${from} imports "${specifier}", which resolves to no declaration file.`,
        );
      } else {
        queue.push(next);
      }
    }
    for (const [, , reference = ""] of content.matchAll(referencePathPattern)) {
      const next = path.resolve(path.dirname(file), reference);
      if (isFile(next)) {
        queue.push(next);
      } else {
        problems.push(
          `${from} references "${reference}", which does not exist.`,
        );
      }
    }
  }

  return { files: [...seen], problems };
};

/** The declaration files a consumer's compiler can reach. */
export const reachableDeclarationFiles = (root: string): string[] =>
  declarationGraphOf(root).files;

/**
 * Packages whose declarations reference something they do not declare, and the
 * reason each one is accepted for now. An entry that is no longer needed fails
 * the build as well, so the list can only shrink.
 */
export const acknowledgedUndeclaredTypeImports: Record<
  string,
  Record<string, string>
> = {
  "@mittwald/flow-react-components": {
    "@mittwald/flow-design-tokens":
      "lib/theming/types.d.ts and lib/tokens/CategoricalColors.d.ts type themselves from the tokens' JSON, which is bundled into the JavaScript while the package is only a devDependency.",
  },
};

const isBuiltin = (name: string) =>
  name.startsWith("node:") || builtinModules.includes(name);

/**
 * Every package a reachable declaration imports must be one the consumer gets
 * installed: this package itself, one of its dependencies, peer or optional
 * dependencies, or a Node built-in. A `/// <reference types>` may name such a
 * package or its `@types` package; `node` names the built-ins.
 */
export const findUndeclaredTypeImports = (
  root: string,
): { file: string; packageName: string }[] => {
  const manifest = readManifest(root);
  const allowed = new Set([
    manifest.name,
    ...Object.keys(manifest.dependencies ?? {}),
    ...Object.keys(manifest.peerDependencies ?? {}),
    ...Object.keys(manifest.optionalDependencies ?? {}),
  ]);
  const isInstalledReference = (reference: string) =>
    reference === "node" ||
    typesPackagesOf(reference).some((name) => allowed.has(name));

  return reachableDeclarationFiles(root).flatMap((file) => {
    const content = readFileSync(file, "utf8");
    const undeclared = [
      ...importedPackagesOf(content).filter(
        (name) => !allowed.has(name) && !isBuiltin(name),
      ),
      ...referencedTypesOf(content)
        .filter((reference) => !isInstalledReference(reference))
        .map(packageNameOf),
    ];
    return [...new Set(undeclared)].map((packageName) => ({
      file: path.relative(root, file),
      packageName,
    }));
  });
};

export const assertInstallableTypeImports = (root: string): void => {
  const { name } = readManifest(root);
  const acknowledged = acknowledgedUndeclaredTypeImports[name] ?? {};
  const found = findUndeclaredTypeImports(root);

  const unexpected = found.filter((f) => !(f.packageName in acknowledged));
  const stale = Object.keys(acknowledged).filter(
    (packageName) => !found.some((f) => f.packageName === packageName),
  );

  const problems = [
    ...declarationGraphOf(root).problems,
    ...unexpected.map(
      (f) =>
        `${f.file} imports "${f.packageName}", which ${name} does not declare — a consumer cannot resolve it. Declare it, or bundle its declarations with withBundledDeclarations().`,
    ),
    ...stale.map(
      (packageName) =>
        `"${packageName}" is acknowledged for ${name} in acknowledgedUndeclaredTypeImports, but no declaration imports it any more. Remove the entry.`,
    ),
  ];

  if (problems.length > 0) {
    throw new Error(
      `Published declarations of ${name}:\n  - ${problems.join("\n  - ")}`,
    );
  }
};

type BeforeWriteFile = (
  filePath: string,
  content: string,
) =>
  | void
  | false
  | { filePath?: string; content?: string }
  | Promise<void | false | { filePath?: string; content?: string }>;

interface DeclarationOptions {
  outDirs: string;
  beforeWriteFile?: BeforeWriteFile;
  afterBuild?: (emittedFiles: Map<string, string>) => void | Promise<void>;
}

/**
 * `unplugin-dts` options that ship the declarations of private workspace
 * packages the JavaScript build inlines.
 *
 * Each bundled package emits its own declarations (its `build` target, into
 * `dist/types`). They are copied to `<outDirs>/_bundled/<name>`, and every
 * import of the package in this package's declarations is rewritten to a
 * relative path into that copy — the layout of everything else stays as it
 * was.
 */
export const withBundledDeclarations = <T extends DeclarationOptions>(
  options: T,
  { root, packages }: { root: string; packages: readonly string[] },
): T => {
  const typesDir = path.resolve(root, options.outDirs);
  const require = createRequire(path.join(root, "package.json"));

  return {
    ...options,
    beforeWriteFile: async (filePath: string, content: string) => {
      const previous = await options.beforeWriteFile?.(filePath, content);
      if (previous === false) {
        return false;
      }
      const current = {
        filePath: previous?.filePath ?? filePath,
        content: previous?.content ?? content,
      };
      return {
        ...current,
        content: rewriteBundledImports(
          current.content,
          current.filePath,
          typesDir,
          packages,
        ),
      };
    },
    afterBuild: async (emittedFiles: Map<string, string>) => {
      for (const name of packages) {
        const source = path.join(
          path.dirname(require.resolve(`${name}/package.json`)),
          "dist/types",
        );
        const target = path.join(typesDir, bundledDirectory, unscoped(name));
        rmSync(target, { recursive: true, force: true });
        cpSync(source, target, { recursive: true });
      }
      await options.afterBuild?.(emittedFiles);
    },
  };
};
