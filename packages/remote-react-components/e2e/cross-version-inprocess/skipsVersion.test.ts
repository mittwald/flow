import { describe, expect, test } from "vitest";
import { skipsVersion } from "./skipsVersion";

describe("skipsVersion", () => {
  test("never skips the non-semver reference pass, so it writes its reference", () => {
    expect(skipsVersion("current", { below: "1.1.41" })).toBe(false);
  });

  test("skips versions below the threshold, but not the threshold itself", () => {
    expect(skipsVersion("1.1.40", { below: "1.1.41" })).toBe(true);
    expect(skipsVersion("1.1.41", { below: "1.1.41" })).toBe(false);
  });

  test("skips the listed versions", () => {
    const skip = { exclude: ["1.2.0-next.0"] };
    expect(skipsVersion("1.2.0-next.0", skip)).toBe(true);
    expect(skipsVersion("1.2.0-next.1", skip)).toBe(false);
  });

  /*
   * The ImageCropper case: #3024 reached `main` before 1.1.41 but only
   * forward-merged into the next line at 1.2.0-next.50, so everything the
   * next line published in between sorts above the `below` threshold without
   * carrying the fix.
   */
  describe("excludeRange covers a late forward-merge", () => {
    const skip = {
      below: "1.1.41",
      excludeRange: ">=1.2.0-next.0 <1.2.0-next.50",
    };

    test.each([
      ["1.1.40", true, "below the threshold"],
      ["1.1.41", false, "the threshold itself carries the fix"],
      ["1.1.52", false, "the 1.1 line keeps its coverage"],
      ["1.2.0-next.0", true, "first next-line version without the fix"],
      ["1.2.0-next.49", true, "last next-line version without the fix"],
      ["1.2.0-next.50", false, "the forward-merge landed here"],
      ["1.2.0-next.65", false, "later next-line versions carry it"],
      ["1.2.0", false, "the final release carries it"],
      ["2.0.0-next.0", false, "a later line is unaffected"],
    ])("%s -> skip=%s (%s)", (version, expected) => {
      expect(skipsVersion(version, skip)).toBe(expected);
    });
  });
});
