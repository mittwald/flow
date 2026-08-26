import { describe, expect, test } from "vitest";
import {
  bundleComposite,
  listComposites,
  readBundledTransform,
} from "../../dev/bundleComposites";

const composites = await listComposites();

/**
 * The bundles in `src/transforms` are generated and committed, so an edit to a
 * composite or to one of the transforms it inlines has to be regenerated. CI
 * catches a stale bundle with `git diff --exit-code` after the build; this
 * catches it while you are still working.
 */
describe("committed bundles are up to date", () => {
  test("there are composites to check", () => {
    expect(composites.length).toBeGreaterThan(0);
  });

  test.for(composites)("%s", async (file) => {
    expect(await readBundledTransform(file)).toBe(await bundleComposite(file));
  });
});
