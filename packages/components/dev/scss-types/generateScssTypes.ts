/**
 * Generates the `*.module.d.scss.ts` declaration files for every SCSS module in
 * `src`, so the committed declarations stay in sync with the styles on every
 * build — not only when a module happens to be transformed by the dev server.
 *
 * It reuses `vite-plugin-sass-dts` (configured as in `vite.config.ts`): it
 * resolves the Vite config once and invokes the plugin's `transform` for each
 * module directly — no dev server, no other plugins. The plugin resolves the
 * `@/…` SCSS aliases from `config.resolve.alias` itself, so the output is
 * byte-identical to what the dev server writes.
 *
 * The plugin writes each declaration in a fire-and-forget callback with no
 * completion signal, and swallows Sass compile errors. To make generation
 * deterministic we delete each declaration first and then wait for the plugin
 * to recreate it: reappearance is a definitive "written this run" signal, and a
 * file that never reappears — because its module failed to compile — throws and
 * fails the build (whether the module is new or already had a committed
 * declaration). Declarations whose SCSS module was removed are pruned.
 */
import { resolveConfig, type Plugin, type ResolvedConfig } from "vite";
import sassDts from "vite-plugin-sass-dts";
import { existsSync, readdirSync, rmSync, statSync } from "node:fs";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

// Must match the `sassDts(...)` options in vite.config.ts so the generated
// declarations are identical to the ones the dev server writes.
const sassDtsOptions = { esmExport: true };

const packageRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../..",
);
const srcDir = path.join(packageRoot, "src");

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

const toDtsPath = (scssFile: string): string =>
  scssFile.replace(/\.module\.scss$/, ".module.d.scss.ts");

/**
 * Wait for `dtsFile` (deleted by the caller beforehand) to be recreated by the
 * plugin. Its reappearance is a definitive per-file "written this run" signal.
 * Throws on timeout — which is what happens when the SCSS module fails to
 * compile, since the plugin then swallows the error and writes nothing.
 */
const waitForRewrite = async (
  dtsFile: string,
  scssFile: string,
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
    `[scss-types] ${path.relative(packageRoot, scssFile)} produced no ` +
      `declaration within ${timeoutMs}ms — the SCSS module likely failed to ` +
      `compile (see the sass error logged above).`,
  );
};

// sass-dts implements these hooks as plain functions that don't use the Rollup
// plugin `this` context, so we can call them directly without a dev server.
type ConfigResolvedHook = (config: ResolvedConfig) => void | Promise<void>;
type TransformHook = (code: string, id: string) => unknown;

const run = async (): Promise<void> => {
  const scssFiles = walk(srcDir).filter((file) =>
    file.endsWith(".module.scss"),
  );

  const config = await resolveConfig(
    { configFile: path.join(packageRoot, "vite.config.ts"), root: packageRoot },
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
  for (const scssFile of scssFiles) {
    const dtsFile = toDtsPath(scssFile);
    rmSync(dtsFile, { force: true });
    await transform("", scssFile);
    await waitForRewrite(dtsFile, scssFile);
  }

  // Remove declarations whose SCSS module no longer exists.
  for (const dtsFile of walk(srcDir).filter((file) =>
    file.endsWith(".module.d.scss.ts"),
  )) {
    const scssFile = dtsFile.replace(/\.module\.d\.scss\.ts$/, ".module.scss");
    if (!existsSync(scssFile)) {
      rmSync(dtsFile);
      console.log(
        `[scss-types] removed orphan ${path.relative(packageRoot, dtsFile)}`,
      );
    }
  }

  console.log(`[scss-types] generated ${scssFiles.length} declaration file(s)`);
};

run().catch((error: unknown) => {
  console.error(error);
  process.exit(1);
});
