// Vite config for the cross-version remote test server. Mirrors
// `e2e/remote-test-server/vite.config.ts`, but the remote document is built
// against an INSTALLED OLD version of `@mittwald/flow-remote-react-components`
// (selected via `FLOW_CROSS_VERSION`, resolved from `cross-version.manifest.json`)
// instead of this package's own `src`.
//
// It aliases the bare specifiers `@mittwald/flow-remote-react-components`
// (+ `/RemoteRoot`) to the installed old copy's real dist files. Vite's alias
// plugin does a literal string replace + filesystem lookup for the rewritten
// specifier — it does NOT re-consult a package.json `exports` map for the
// replacement — so we resolve each `exports` subpath to its on-disk file
// ourselves (`aliasPackageExports`), one exact-match alias per subpath.
//
// The remote side runs in its OWN Vite dev server / document, loaded into an
// iframe by `RemoteRenderer` — a separate origin/realm from the host. There is
// therefore no same-realm `customElements` collision to route around, so
// (unlike the in-process harness in `dev/cross-version/vitest.config.ts`) we do
// NOT alias `@mittwald/flow-remote-elements` to the current package; the old
// package's own copy is used as-is. No `@quilted/threads` handling is needed
// either (confirmed: valid old versions serialize props cleanly over the real
// connection with the unpatched, installed threads).
//
// react/react-dom bare specifiers ARE aliased to the old install's own copies
// so the whole remote document uses exactly one React module instance — mixing
// two separately-loaded copies of `react` in one page throws "Invalid hook
// call" regardless of matching version numbers.
import { readFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { mergeConfig } from "vite";
import defaultConfig from "../../vite.config";
import { resolveCrossVersionTarget } from "./resolveCrossVersionTarget";

const here = dirname(fileURLToPath(import.meta.url));
const packageRoot = resolve(here, "../..");

const target = resolveCrossVersionTarget();

interface PackageExportsMap {
  exports?: Record<string, string | Record<string, string>>;
}

const resolveExportTarget = (
  value: string | Record<string, string> | undefined,
): string | undefined => {
  if (!value) return undefined;
  if (typeof value === "string") return value;
  return value.default ?? value.import ?? value.require ?? undefined;
};

/**
 * Build one alias per subpath declared in `<packageDir>/package.json`'s
 * `exports` map, `find`-keyed as `<specifierPrefix><subpath>` and pointing at
 * the real on-disk file. Subpath entries come before the bare "." entry: Vite's
 * alias matcher treats a plain-string `find` as matching both the exact string
 * and `find + "/…"` (prefix), picking the FIRST match in array order, so the
 * bare "." alias must not shadow a "/RemoteRoot" subpath alias.
 */
const aliasPackageExports = (
  specifierPrefix: string,
  packageDir: string,
): { find: string; replacement: string }[] => {
  const pkgJson = JSON.parse(
    readFileSync(join(packageDir, "package.json"), "utf8"),
  ) as PackageExportsMap;
  const exportsMap = pkgJson.exports ?? { ".": "./dist/js/index.mjs" };

  const entries = Object.entries(exportsMap).sort(([a], [b]) => {
    if (a === ".") return 1;
    if (b === ".") return -1;
    return 0;
  });

  return entries.flatMap(([key, value]) => {
    const resolvedTarget = resolveExportTarget(value);
    if (!resolvedTarget) return [];
    const subpath = key === "." ? "" : key.slice(1); // "./RemoteRoot" -> "/RemoteRoot"
    return [
      {
        find: `${specifierPrefix}${subpath}`,
        replacement: join(packageDir, resolvedTarget),
      },
    ];
  });
};

/**
 * Package-specifier aliases for the selected version.
 *
 * - `current` → this workspace's `src` (mirrors how `e2e/remote-test-server`
 *   imports `../../src` directly): `.` → `src/index.ts`, `/RemoteRoot` →
 *   `src/components/RemoteRoot.tsx`. No react alias — the current build uses
 *   the workspace's own react (as the normal browser suite does).
 * - Installed old version → the old copy's dist via its `exports` map, plus
 *   react/react-dom pinned to the old install's own copies so the remote
 *   document runs on a single React instance (mixing two separately-loaded
 *   copies of react in one page throws "Invalid hook call" regardless of
 *   matching version numbers).
 */
const versionAliases: { find: string; replacement: string }[] = target.isCurrent
  ? [
      {
        find: "@mittwald/flow-remote-react-components/RemoteRoot",
        replacement: join(packageRoot, "src/components/RemoteRoot.tsx"),
      },
      {
        find: "@mittwald/flow-remote-react-components/react-hook-form",
        replacement: join(
          packageRoot,
          "src/integrations/react-hook-form/index.ts",
        ),
      },
      {
        find: "@mittwald/flow-remote-react-components",
        replacement: join(packageRoot, "src/index.ts"),
      },
    ]
  : (() => {
      // installPath ends in
      // `.../node_modules/@mittwald/flow-remote-react-components`; two levels
      // up is the old install's `node_modules` root (its own react lives
      // there).
      const oldNodeModules = resolve(target.installPath, "../..");
      return [
        {
          find: "react-dom/client",
          replacement: join(oldNodeModules, "react-dom/client.js"),
        },
        {
          find: "react-dom",
          replacement: join(oldNodeModules, "react-dom/index.js"),
        },
        {
          find: "react/jsx-dev-runtime",
          replacement: join(oldNodeModules, "react/jsx-dev-runtime.js"),
        },
        {
          find: "react/jsx-runtime",
          replacement: join(oldNodeModules, "react/jsx-runtime.js"),
        },
        { find: "react", replacement: join(oldNodeModules, "react/index.js") },
        ...aliasPackageExports(
          "@mittwald/flow-remote-react-components",
          target.installPath,
        ),
      ];
    })();

export default mergeConfig(defaultConfig, {
  optimizeDeps: {
    include: ["react-error-boundary"],
  },
  resolve: {
    alias: versionAliases,
  },
  server: {
    fs: {
      // The installed old versions live in an isolated install dir outside the
      // normal workspace tree; allow the dev server to serve from it.
      allow: [
        packageRoot,
        join(packageRoot, "e2e/tests"),
        join(packageRoot, "node_modules", ".cross-version"),
      ],
    },
  },
});
