import { cpSync, existsSync, readFileSync, rmSync } from "node:fs";
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

const isBare = (specifier: string): boolean =>
  !specifier.startsWith(".") && !path.isAbsolute(specifier);

/** `@scope/name/deep/path` → `@scope/name`, `name/deep` → `name`. */
export const packageNameOf = (specifier: string): string => {
  const segments = specifier.split("/");
  return specifier.startsWith("@")
    ? segments.slice(0, 2).join("/")
    : (segments[0] ?? specifier);
};

/** Every package a declaration file imports, `/// <reference types>` included. */
export const importedPackagesOf = (content: string): string[] => {
  const specifiers = [
    ...Array.from(content.matchAll(specifierPattern), (m) => m[3] ?? ""),
    ...Array.from(content.matchAll(referenceTypesPattern), (m) => m[2] ?? ""),
  ];
  return [...new Set(specifiers.filter(isBare).map(packageNameOf))];
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

const relativeSpecifiersOf = (content: string): string[] =>
  Array.from(content.matchAll(specifierPattern), (m) => m[3] ?? "").filter(
    (specifier) => specifier.startsWith("."),
  );

/** The declaration file a relative specifier names, if there is one. */
const resolveDeclaration = (
  fromFile: string,
  specifier: string,
): string | undefined => {
  const base = path.resolve(path.dirname(fromFile), specifier);
  const candidates = [
    base,
    base.replace(/\.[cm]?js$/, ".d.ts"),
    `${base}.d.ts`,
    path.join(base, "index.d.ts"),
  ];
  return candidates.find(
    (candidate) => /\.d\.[cm]?ts$/.test(candidate) && existsSync(candidate),
  );
};

/**
 * The declaration files a consumer's compiler can reach: the `types` entries
 * and everything they import relatively. A file nothing reaches — a story
 * helper, a test augmentation — is dead weight, but it cannot fail anyone's
 * build.
 */
export const reachableDeclarationFiles = (root: string): string[] => {
  const queue = typeEntriesOf(readManifest(root)).map((entry) =>
    path.resolve(root, entry),
  );
  const seen = new Set<string>();

  for (let file = queue.pop(); file !== undefined; file = queue.pop()) {
    if (seen.has(file) || !existsSync(file)) {
      continue;
    }
    seen.add(file);
    for (const specifier of relativeSpecifiersOf(readFileSync(file, "utf8"))) {
      const next = resolveDeclaration(file, specifier);
      if (next) {
        queue.push(next);
      }
    }
  }

  return [...seen];
};

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

/**
 * Every package a reachable declaration imports must be one the consumer gets
 * installed: this package itself, one of its dependencies, peer or optional
 * dependencies, or a Node built-in.
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
  const isBuiltin = (name: string) =>
    name.startsWith("node:") || builtinModules.includes(name);

  return reachableDeclarationFiles(root).flatMap((file) =>
    importedPackagesOf(readFileSync(file, "utf8"))
      .filter((name) => !allowed.has(name) && !isBuiltin(name))
      .map((packageName) => ({
        file: path.relative(root, file),
        packageName,
      })),
  );
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
