/**
 * Generates the `*.module.d.scss.ts` declaration files for every SCSS module in
 * `src`, so the committed declarations stay in sync with the styles on every
 * build — not only when a module happens to be transformed by the dev server.
 *
 * It reuses `vite-plugin-sass-dts` (configured as in `vite.config.ts`): it
 * resolves the Vite config once and invokes the plugin's `transform` for each
 * module directly — no dev server, no other plugins. The plugin resolves the
 * `@/…` SCSS aliases from `config.resolve.alias` itself, so the output is
 * byte-identical to what the dev server writes. Declarations whose SCSS module
 * was removed are deleted.
 *
 * `vite-plugin-sass-dts` writes each declaration in a fire-and-forget callback,
 * so after triggering the transforms we wait until the files stop changing.
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
 * Wait until every expected declaration exists and its mtime stops changing.
 * Throws on timeout so a hung or failed generation (e.g. a SCSS module that
 * fails to compile, whose declaration is therefore never written) fails the
 * build instead of silently leaving stale or missing files.
 */
const waitForWrites = async (
  expected: string[],
  { stableMs = 1500, timeoutMs = 180_000 } = {},
): Promise<void> => {
  const start = Date.now();
  let lastChange = Date.now();
  let previous = "";
  while (Date.now() - start < timeoutMs) {
    await delay(300);
    let signature = "";
    let allExist = true;
    for (const file of expected) {
      try {
        signature += `${statSync(file).mtimeMs};`;
      } catch {
        allExist = false;
        signature += "-;";
      }
    }
    if (signature !== previous) {
      previous = signature;
      lastChange = Date.now();
    }
    if (allExist && Date.now() - lastChange >= stableMs) {
      return;
    }
  }
  const missing = expected.filter((file) => !existsSync(file));
  const [firstMissing] = missing;
  throw new Error(
    `[scss-types] timed out after ${timeoutMs}ms waiting for declarations to settle` +
      (firstMissing
        ? ` — ${missing.length} still missing, e.g. ${path.relative(packageRoot, firstMissing)}`
        : " — files exist but kept changing"),
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
  for (const scssFile of scssFiles) {
    await transform("", scssFile);
  }
  await waitForWrites(scssFiles.map(toDtsPath));

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
