import { existsSync, readFileSync, readdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = fileURLToPath(new URL("../../../../", import.meta.url));
const repoFile = (path: string): string =>
  readFileSync(join(repoRoot, path), "utf8");

const componentsSrc = "packages/components/src";
const remoteSrc = "packages/remote-react-components/src";

const componentsPackage = "@mittwald/flow-react-components";

/**
 * The file a module specifier resolves to, if any.
 *
 * The workspace form matters as much as the relative one: the remote package
 * pulls the universal surface in as `@mittwald/flow-react-components/…`, and a
 * resolver that only understands `@/` and `./` stops right before it.
 */
const resolveModule = (from: string, specifier: string): string | undefined => {
  let base: string;

  if (specifier.startsWith(`${componentsPackage}/`)) {
    base = join(
      componentsSrc,
      "index",
      specifier.slice(componentsPackage.length + 1),
    );
  } else if (specifier === componentsPackage) {
    base = join(componentsSrc, "index", "default");
  } else if (specifier.startsWith("@/")) {
    base = join(componentsSrc, specifier.slice(2));
  } else if (specifier.startsWith(".")) {
    base = join(dirname(from), specifier);
  } else {
    // A third-party package — nothing to read in this repository.
    return undefined;
  }

  return [`${base}.ts`, `${base}.tsx`, `${base}/index.ts`].find((candidate) =>
    existsSync(join(repoRoot, candidate)),
  );
};

/**
 * Every name a file exports, following `export * from` into the repository.
 *
 * A rough parse is enough here: these are hand-maintained barrel files with
 * plain export lists, and the check only ever asks whether a name is
 * reachable.
 */
const namedExports = (file: string, seen = new Set<string>()): string[] => {
  if (seen.has(file)) {
    return [];
  }
  seen.add(file);

  const source = repoFile(file);
  const names: string[] = [];

  for (const block of source.matchAll(/export\s*(?:type\s*)?\{([^}]*)\}/g)) {
    for (const part of (block[1] ?? "").split(",")) {
      // `A`, `type A`, `A as B` — an alias is what the consumer sees.
      const match = /^(?:type\s+)?(\w+)(?:\s+as\s+(\w+))?$/.exec(part.trim());
      if (match) {
        names.push(match[2] ?? (match[1] as string));
      }
    }
  }

  for (const star of source.matchAll(/export \* from "([^"]+)";/g)) {
    const target = resolveModule(file, star[1] as string);
    if (target) {
      names.push(...namedExports(target, seen));
    }
  }

  return names;
};

/**
 * The names `@mittwald/flow-remote-react-components` actually exports.
 *
 * Three sources, and the middle one is the easy one to miss: one module per
 * `@flr-generate` component, **everything the main package's `flr-universal`
 * entry exports** — the remote package re-exports it wholesale through
 * `FlowRemoteUniversal` — and the react-hook-form entry.
 *
 * What is not in there: prop types other than the universal ones, error
 * classes, and six of the main package's nine entries.
 */
export const remoteExports = new Set([
  ...[
    ...repoFile(`${remoteSrc}/auto-generated/index.ts`).matchAll(
      /^export \* from "\.\/(\w+)";$/gm,
    ),
  ].map((match) => match[1] as string),
  ...namedExports(`${remoteSrc}/components/index.ts`),
  ...namedExports(`${remoteSrc}/integrations/react-hook-form/index.ts`),
]);

/** Every module specifier a consumer may import, per workspace package. */
export const packageEntries = new Set(
  readdirSync(join(repoRoot, "packages")).flatMap((dir) => {
    let manifest: { name?: string; exports?: Record<string, unknown> };
    try {
      manifest = JSON.parse(repoFile(`packages/${dir}/package.json`)) as {
        name?: string;
        exports?: Record<string, unknown>;
      };
    } catch {
      return [];
    }

    const { name, exports } = manifest;
    if (!name || !exports) {
      return [];
    }

    return Object.keys(exports).map((entry) =>
      entry === "." ? name : `${name}${entry.slice(1)}`,
    );
  }),
);

/**
 * The transform source file for `name`: a migration's `transform.ts` when
 * `name` has one, otherwise a same-named file in `src/tools` (currently only
 * `to-remote-package`).
 */
const transformFile = (name: string): string => {
  const migrationPath = `packages/codemods/src/migrations/${name}/transform.ts`;
  return existsSync(join(repoRoot, migrationPath))
    ? migrationPath
    : `packages/codemods/src/tools/${name}.ts`;
};

/** The module specifiers a transform scopes itself to, read from its source. */
export const declaredPackages = (name: string): string[] => {
  const source = repoFile(transformFile(name));
  const declaration =
    /const flowPackages? = (\[[^\]]*\]|"[^"]*");/.exec(source)?.[1] ?? "";
  return [...declaration.matchAll(/"([^"]+)"/g)].map(
    (match) => match[1] as string,
  );
};
