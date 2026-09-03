import { execFileSync } from "node:child_process";
import { mkdirSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

/**
 * Compiles the transforms to CommonJS and marks the output as CommonJS.
 *
 * Two steps, and the second is not optional. `tsconfig.transforms.json` (see
 * its comments for why CommonJS at all) emits `dist/migrations/<id>/
 * transform.js` and `dist/tools/<name>.js`, but this package is `"type":
 * "module"` — so Node would read those `.js` files as ESM and throw `exports is
 * not defined` on the first line. A `package.json` holding `{"type":
 * "commonjs"}` inside each output directory overrides the field for everything
 * below it, which is what makes the emitted files loadable.
 *
 * The marker directories are exactly the two `outDir` subtrees the compile
 * produces, so a transform added under either is covered without touching this
 * file.
 */
const packageRoot = new URL("../", import.meta.url);
const commonJsSubtrees = ["dist/migrations", "dist/tools"];

execFileSync("tsc", ["-p", "tsconfig.transforms.json"], {
  cwd: fileURLToPath(packageRoot),
  stdio: "inherit",
});

for (const subtree of commonJsSubtrees) {
  const dir = fileURLToPath(new URL(subtree, packageRoot));
  mkdirSync(dir, { recursive: true });
  writeFileSync(
    `${dir}/package.json`,
    `${JSON.stringify({ type: "commonjs" }, null, 2)}\n`,
  );
}
