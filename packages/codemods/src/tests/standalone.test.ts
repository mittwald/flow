import { readdirSync } from "node:fs";
import { describe, expect, test } from "vitest";
import { runTransform, transformsDir } from "./runTransform";

/**
 * Every file in `src/transforms` is served to consumers by URL, and jscodeshift
 * runs a downloaded transform from a temp directory of its own. A transform
 * that imports a sibling file therefore dies with `MODULE_NOT_FOUND` on the
 * consumer's machine while working fine in this repo.
 *
 * `src/composites` exists for transforms that do compose others — the bundler
 * inlines them into a standalone file, which is what this asserts.
 */
describe("every transform runs standalone", () => {
  const transformNames = readdirSync(transformsDir)
    .filter((file) => file.endsWith(".ts"))
    .map((file) => file.replace(/\.ts$/, ""));

  test("there are transforms to check", () => {
    expect(transformNames.length).toBeGreaterThan(0);
  });

  test.for(transformNames)("%s", (name) => {
    // A file the transform has nothing to do with still has to be processed —
    // loading the transform is what is under test here.
    expect(runTransform(name, "export const noop = 1;\n")).toBe(
      "export const noop = 1;\n",
    );
  });
});
