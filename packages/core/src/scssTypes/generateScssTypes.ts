/**
 * Generates the declaration file for every CSS module below `srcDir`, so the
 * committed declarations stay in sync with the styles on every build — not only
 * when a module happens to be transformed by a dev server.
 *
 * Without them a CSS-module import is typed by an ambient wildcard
 * (`vite/client` for the libraries, `next/types/global` for the apps) as `{
 * readonly [key: string]: string }`. A mistyped or wrong-module class key then
 * type-checks fine and evaluates to `undefined` at runtime, so React drops the
 * `className` with no error anywhere.
 *
 * "scss" in the name is the historical target name (`build:scss-types`); every
 * CSS-module flavour `vite-plugin-sass-dts` understands is covered —
 * `.module.scss`, `.module.sass` and `.module.css`.
 *
 * It reuses `vite-plugin-sass-dts` (configured exactly as in the consuming
 * package's Vite setup): it resolves the Vite config once and invokes the
 * plugin's `transform` for each module directly — no dev server, no other
 * plugins. The plugin resolves SCSS aliases from `config.resolve.alias` itself,
 * so the output is byte-identical to what a dev server writes.
 *
 * The plugin writes each declaration in a fire-and-forget callback with no
 * completion signal, and swallows Sass compile errors. To make generation
 * deterministic we delete each declaration first and then wait for the plugin
 * to recreate it: reappearance is a definitive "written this run" signal, and a
 * file that never reappears — because its module failed to compile — throws and
 * fails the build (whether the module is new or already had a committed
 * declaration). Declarations whose CSS module was removed are pruned.
 *
 * Consumers need `allowArbitraryExtensions` in their tsconfig: it is what makes
 * TypeScript resolve `./X.module.scss` to `./X.module.d.scss.ts`. Without it
 * the declarations are inert and the ambient wildcard silently wins again.
 */
import {
  resolveConfig,
  type InlineConfig,
  type Plugin,
  type ResolvedConfig,
} from "vite";
import sassDts from "vite-plugin-sass-dts";
import { existsSync, readdirSync, rmSync, statSync } from "node:fs";
import path from "node:path";

/** Must match the `sassDts(...)` options of the consuming Vite setup. */
const sassDtsOptions = { esmExport: true };

const moduleFileRe = /\.module\.(scss|sass|css)$/;
const declarationFileRe = /\.module\.d\.(scss|sass|css)\.ts$/;

export interface GenerateScssTypesOptions {
  /** Absolute path of the package. Only used to shorten log output. */
  packageRoot: string;
  /** Absolute directory that is scanned for CSS modules. */
  srcDir: string;
  /**
   * The Vite config the plugin reads its CSS options and aliases from. Point
   * `configFile` at a package's own `vite.config.ts` to stay identical to its
   * dev server, or pass `configFile: false` plus an inline config for a package
   * that has no Vite setup at all (a Next.js app).
   */
  viteConfig: InlineConfig;
}

const walk = (dir: string, out: string[] = []): string[] => {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(full, out);
    } else {
      out.push(full);
    }
  }
  return out;
};

const delay = (ms: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));

/** `Foo.module.scss` → `Foo.module.d.scss.ts` (mirrors the plugin's naming). */
const toDtsPath = (moduleFile: string): string =>
  moduleFile.replace(moduleFileRe, ".module.d.$1.ts");

/** `Foo.module.d.scss.ts` → `Foo.module.scss`. */
const toModulePath = (dtsFile: string): string =>
  dtsFile.replace(declarationFileRe, ".module.$1");

/**
 * Wait for `dtsFile` (deleted by the caller beforehand) to be recreated by the
 * plugin. Its reappearance is a definitive per-file "written this run" signal.
 * Throws on timeout — which is what happens when the CSS module fails to
 * compile, since the plugin then swallows the error and writes nothing.
 */
const waitForRewrite = async (
  dtsFile: string,
  moduleFile: string,
  packageRoot: string,
  { timeoutMs = 30_000, intervalMs = 25 } = {},
): Promise<void> => {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    try {
      if (statSync(dtsFile).size > 0) {
        return;
      }
    } catch {
      // Not written yet.
    }
    await delay(intervalMs);
  }
  throw new Error(
    `[scss-types] ${path.relative(packageRoot, moduleFile)} produced no ` +
      `declaration within ${timeoutMs}ms — the CSS module likely failed to ` +
      `compile (see the sass error logged above).`,
  );
};

// sass-dts implements these hooks as plain functions that don't use the Rollup
// plugin `this` context, so we can call them directly without a dev server.
type ConfigResolvedHook = (config: ResolvedConfig) => void | Promise<void>;
type TransformHook = (code: string, id: string) => unknown;

export const generateScssTypes = async (
  options: GenerateScssTypesOptions,
): Promise<void> => {
  const { packageRoot, srcDir, viteConfig } = options;

  const moduleFiles = walk(srcDir).filter((file) => moduleFileRe.test(file));

  const config = await resolveConfig(
    viteConfig,
    "serve",
    "development",
    "development",
  );

  const plugin = sassDts(sassDtsOptions) as Plugin;
  const configResolved = plugin.configResolved as unknown as ConfigResolvedHook;
  const transform = plugin.transform as unknown as TransformHook;
  await configResolved(config);

  // Sequential: only the in-flight declaration is ever deleted, so a failure
  // leaves every other committed file untouched.
  for (const moduleFile of moduleFiles) {
    const dtsFile = toDtsPath(moduleFile);
    rmSync(dtsFile, { force: true });
    await transform("", moduleFile);
    await waitForRewrite(dtsFile, moduleFile, packageRoot);
  }

  // Remove declarations whose CSS module no longer exists.
  for (const dtsFile of walk(srcDir).filter((file) =>
    declarationFileRe.test(file),
  )) {
    if (!existsSync(toModulePath(dtsFile))) {
      rmSync(dtsFile);
      console.log(
        `[scss-types] removed orphan ${path.relative(packageRoot, dtsFile)}`,
      );
    }
  }

  console.log(
    `[scss-types] generated ${moduleFiles.length} declaration file(s)`,
  );
};
