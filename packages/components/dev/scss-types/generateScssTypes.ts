/**
 * Generates the `*.module.d.scss.ts` declarations for every SCSS module in
 * `src`. The generator itself is shared with the other packages — see
 * `@mittwald/flow-core/src/scssTypes/generateScssTypes.ts` for what it does and
 * why it works the way it does.
 *
 * It reads this package's own `vite.config.ts`, so the declarations are
 * byte-identical to the ones Storybook and the browser tests write at runtime.
 */
import { generateScssTypes } from "@mittwald/flow-core/src/scssTypes/generateScssTypes.ts";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

const packageRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../..",
);

generateScssTypes({
  packageRoot,
  srcDir: path.join(packageRoot, "src"),
  viteConfig: {
    configFile: path.join(packageRoot, "vite.config.ts"),
    root: packageRoot,
  },
}).catch((error: unknown) => {
  console.error(error);
  process.exit(1);
});
