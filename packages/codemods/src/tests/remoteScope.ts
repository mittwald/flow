import { readFileSync, readdirSync } from "node:fs";
import { fileURLToPath } from "node:url";

const repoFile = (path: string): string =>
  readFileSync(
    fileURLToPath(new URL(`../../../../${path}`, import.meta.url)),
    "utf8",
  );

const remotePackage = "packages/remote-react-components";

/**
 * The names `@mittwald/flow-remote-react-components` actually exports.
 *
 * The remote package mirrors the component API, but only the component API: one
 * module per `@flr-generate` component, a handful of hand-written ones, and the
 * react-hook-form entry. No prop types, no error classes, no lib functions.
 */
export const remoteExports = new Set([
  // One `export * from "./<Component>"` per remote-capable component.
  ...[
    ...repoFile(`${remotePackage}/src/auto-generated/index.ts`).matchAll(
      /^export \* from "\.\/(\w+)";$/gm,
    ),
  ].map((match) => match[1] as string),
  ...[
    ...repoFile(`${remotePackage}/src/components/index.ts`).matchAll(
      /^export \* from "\.\/(\w+)";$/gm,
    ),
  ].map((match) => match[1] as string),
  // The react-hook-form entry re-exports a small, explicit list.
  ...[
    ...repoFile(
      `${remotePackage}/src/integrations/react-hook-form/index.ts`,
    ).matchAll(/\b([A-Z]\w+)\b/g),
  ].map((match) => match[1] as string),
]);

/** Every module specifier a consumer may import, per workspace package. */
export const packageEntries = new Set(
  readdirSync(fileURLToPath(new URL("../../../", import.meta.url)))
    .flatMap((dir) => {
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
    })
    .filter(Boolean),
);

const transformsDir = fileURLToPath(new URL("../transforms", import.meta.url));

/** The module specifiers a transform scopes itself to, read from its source. */
export const declaredPackages = (name: string): string[] => {
  const source = readFileSync(`${transformsDir}/${name}.ts`, "utf8");
  const declaration =
    /const flowPackages? = (\[[^\]]*\]|"[^"]*");/.exec(source)?.[1] ?? "";
  return [...declaration.matchAll(/"([^"]+)"/g)].map(
    (match) => match[1] as string,
  );
};
