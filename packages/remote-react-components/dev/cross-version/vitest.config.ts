import { readFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { mergeConfig } from "vite";
import { defineConfig } from "vitest/config";
import defaultConfig from "../../vite.config";
import { vitestBrowserTestConfig } from "../../../core/src/vitestBrowserTestConfig";

const here = dirname(fileURLToPath(import.meta.url));
const packageRoot = resolve(here, "../..");

interface Manifest {
  targets: { category: string; version: string; installPath: string }[];
}

const readManifest = (): Manifest => {
  try {
    return JSON.parse(
      readFileSync(join(packageRoot, "cross-version.manifest.json"), "utf8"),
    ) as Manifest;
  } catch {
    throw new Error(
      "cross-version.manifest.json missing. Run `test:cross-version:prepare` first.",
    );
  }
};

const manifest = readManifest();

interface PackageExportsMap {
  exports?: Record<string, string | Record<string, string>>;
}

/**
 * Resolve every subpath declared in the installed package's own
 * `exports` map to its real on-disk file. Vite's alias plugin only does a
 * literal string replace + filesystem lookup for the rewritten specifier —
 * it does not re-consult a package.json `exports` map for the replacement
 * (that only happens for bare-specifier/node-style resolution). So aliasing
 * `@flr-crossversion/<version>` to the installed package *directory* works
 * for the "." export (directory resolution follows package.json), but a
 * deep import like `@flr-crossversion/<version>/RemoteRoot` would be
 * rewritten to `<installPath>/RemoteRoot`, a path that doesn't exist on disk
 * (the real file lives at `<installPath>/dist/js/RemoteRoot.mjs`). To avoid
 * that, resolve each export key ourselves and alias directly to the real
 * file, one exact-match alias per subpath.
 */
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
 * the real on-disk file. See the comment on `resolveExportTarget` callers
 * below for why this is necessary (Vite's alias plugin does not itself
 * re-consult `exports` for the rewritten specifier).
 *
 * Returns subpath entries before the bare "." entry — Vite's alias matcher
 * treats a plain-string `find` as matching both the exact string and
 * `find + "/…"` (prefix match), and picks the FIRST matching entry in array
 * order. If the bare "." alias came before a "/RemoteRoot" subpath alias, an
 * import of ".../RemoteRoot" would incorrectly match the bare entry's prefix
 * and resolve to "<index.mjs path>/RemoteRoot".
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
    const target = resolveExportTarget(value);
    if (!target) return [];
    const subpath = key === "." ? "" : key.slice(1); // "./RemoteRoot" -> "/RemoteRoot"
    return [
      {
        find: `${specifierPrefix}${subpath}`,
        replacement: join(packageDir, target),
      },
    ];
  });
};

// One alias per resolved version → its installed package directory's real
// export files (`@flr-crossversion/<version>` / `@flr-crossversion/<version>/RemoteRoot`).
const versionAliases = manifest.targets.flatMap((t) =>
  aliasPackageExports(`@flr-crossversion/${t.version}`, t.installPath),
);

/**
 * The installed OLD bundle depends on its OWN (old, isolated-npm-installed)
 * copy of `@mittwald/flow-remote-elements`. That package's auto-generated
 * modules unconditionally call `customElements.define(tag, Class)` at
 * import time. The CURRENT host renderer (`@mittwald/flow-remote-react-renderer`)
 * also imports (a barrel that pulls in) `@mittwald/flow-remote-elements` and
 * registers the same tag names. In real production these two copies run in
 * separate documents (extension iframe vs. host document), so they never
 * collide. Forcing old+current into ONE in-process JS realm for this spike
 * makes both registrations land in the same `customElements` registry, and
 * the second `define()` call throws
 * `NotSupportedError: Cannot define multiple custom elements with the same
 * tag name` — a same-realm artifact of the spike harness, not a real
 * cross-version incompatibility. Alias the bare specifier to the CURRENT
 * package so both sides load the exact same module instance (one
 * registration). `@mittwald/flow-remote-core`'s `connectRemoteReceiver` is
 * deliberately left un-aliased — that IS the versioned protocol layer this
 * spike is meant to exercise.
 */
const sharedRemoteElementsAlias = aliasPackageExports(
  "@mittwald/flow-remote-elements",
  resolve(packageRoot, "../remote-elements"),
);

export default mergeConfig(
  defaultConfig,
  defineConfig({
    resolve: {
      alias: [...sharedRemoteElementsAlias, ...versionAliases],
      dedupe: ["react", "react-dom"],
    },
    optimizeDeps: {
      // Installed old bundles live outside the workspace; let Vite pre-bundle them.
      include: manifest.targets.map((t) => `@flr-crossversion/${t.version}`),
      // Without this, Vite's optimizer transitively inlines a SEPARATE
      // bundled copy of (the current, aliased) `@mittwald/flow-remote-elements`
      // into each `@flr-crossversion/<version>` chunk, while the CURRENT host
      // renderer (a workspace package, excluded from optimization) loads the
      // exact same file un-bundled. That's two distinct module instances of
      // code with global side effects (`customElements.define`), and the
      // second one throws `NotSupportedError: Cannot define multiple custom
      // elements with the same tag name`. Excluding it keeps the optimizer
      // from ever inlining it, so both paths share the one un-bundled module.
      exclude: ["@mittwald/flow-remote-elements"],
    },
    server: {
      fs: {
        // Allow serving the isolated install dir.
        allow: [packageRoot, join(packageRoot, "node_modules", ".cross-version")],
      },
    },
    test: {
      globals: true,
      ...vitestBrowserTestConfig,
      name: "cross-version",
      include: ["dev/cross-version/**/*.browser.test.{ts,tsx}"],
      setupFiles: "./dev/vitest/setupBrowser.ts",
    },
  }),
);
