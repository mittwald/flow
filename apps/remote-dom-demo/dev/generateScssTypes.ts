/**
 * Generates the `*.module.d.scss.ts` / `*.module.d.css.ts` declarations for
 * every CSS module in `src`. The generator itself is shared with the packages —
 * see `@mittwald/flow-core/src/scssTypes/generateScssTypes.ts`.
 *
 * There is no Vite setup here to borrow from, so the plugin gets a minimal
 * inline config instead:
 *
 * - `configFile: false` — nothing must be auto-discovered; Next has no Vite
 *   config at all.
 * - The `@/…` alias mirrors `tsconfig.json`'s `paths`, so a future `@use "@/…"`
 *   in a module resolves like everywhere else.
 * - No `css.modules.localsConvention`: Next hands class names through exactly as
 *   authored, which is what the plugin's default reproduces. Setting one would
 *   type keys that do not exist at runtime.
 */
import { generateScssTypes } from "@mittwald/flow-core/src/scssTypes/generateScssTypes.ts";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

const appRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
);
const srcDir = path.join(appRoot, "src");

generateScssTypes({
  packageRoot: appRoot,
  srcDir,
  viteConfig: {
    configFile: false,
    root: appRoot,
    resolve: {
      alias: {
        "@": srcDir,
      },
    },
  },
}).catch((error: unknown) => {
  console.error(error);
  process.exit(1);
});
