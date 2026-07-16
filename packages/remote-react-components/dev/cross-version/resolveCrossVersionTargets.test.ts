import { describe, expect, it } from "vitest";
import { resolveCrossVersionTargets } from "./resolveCrossVersionTargets";

// A stable released history spanning two minor lines.
const released = ["0.1.0", "0.1.1", "0.1.2", "0.2.0", "0.2.1", "0.2.2"];

describe("resolveCrossVersionTargets — semver categories", () => {
  it("resolves previous, firstOfLine and latestOfPreviousLine for a released version", () => {
    const result = resolveCrossVersionTargets("0.2.2", released);
    const byCategory = Object.fromEntries(
      result.map((r) => [r.category, r.version]),
    );
    expect(byCategory.previous).toBe("0.2.1");
    expect(byCategory.firstOfLine).toBe("0.2.0");
    expect(byCategory.latestOfPreviousLine).toBe("0.1.2");
  });

  it("ignores versions at or above the current version", () => {
    const result = resolveCrossVersionTargets("0.2.0", released);
    for (const target of result) {
      expect(target.version.startsWith("0.2.")).not.toBe(true);
    }
    // previous of 0.2.0 is the newest below it
    expect(result.find((r) => r.category === "previous")?.version).toBe(
      "0.1.2",
    );
  });

  it("drops categories that cannot resolve (no previous line) without throwing", () => {
    const result = resolveCrossVersionTargets("0.1.2", released);
    expect(
      result.find((r) => r.category === "latestOfPreviousLine"),
    ).toBeUndefined();
    expect(result.find((r) => r.category === "previous")?.version).toBe(
      "0.1.1",
    );
  });

  it("de-duplicates versions shared by multiple categories", () => {
    const result = resolveCrossVersionTargets("0.2.1", released);
    const versions = result.map((r) => r.version);
    expect(new Set(versions).size).toBe(versions.length);
  });
});

describe("resolveCrossVersionTargets — exclusions", () => {
  it("skips an excluded version and steps to the next valid candidate", () => {
    const result = resolveCrossVersionTargets("0.2.2", released, ["0.2.1"]);
    // previous should now skip the broken 0.2.1 and pick 0.2.0
    expect(result.find((r) => r.category === "previous")?.version).toBe(
      "0.2.0",
    );
    expect(result.some((r) => r.version === "0.2.1")).toBe(false);
  });
});

describe("resolveCrossVersionTargets — alpha-offset fallback", () => {
  const alpha = Array.from({ length: 250 }, (_, i) => `0.2.0-alpha.${i + 1}`);

  it("falls back to computed offsets when categories collapse on a prerelease line", () => {
    const current = "0.2.0-alpha.250";
    const result = resolveCrossVersionTargets(current, alpha, [], {
      offsets: [10, 100, 200],
    });
    const versions = result.map((r) => r.version);
    expect(versions).toContain("0.2.0-alpha.240"); // 250 - 10
    expect(versions).toContain("0.2.0-alpha.150"); // 250 - 100
    expect(versions).toContain("0.2.0-alpha.50"); //  250 - 200
  });

  it("drops offsets that fall before the earliest published version", () => {
    const current = "0.2.0-alpha.250";
    const short = alpha.slice(-30); // only 30 published
    const result = resolveCrossVersionTargets(current, short, [], {
      offsets: [10, 100, 200],
    });
    const versions = result.map((r) => r.version);
    expect(versions).toContain("0.2.0-alpha.240"); // -10 exists
    expect(versions.some((v) => v === "0.2.0-alpha.150")).toBe(false); // -100 gone
  });

  it("honours exclusions in offset mode by stepping to the next older version", () => {
    const current = "0.2.0-alpha.250";
    const result = resolveCrossVersionTargets(
      current,
      alpha,
      ["0.2.0-alpha.240"],
      {
        offsets: [10],
      },
    );
    // -10 would be alpha.240 (excluded) → step to alpha.239
    expect(result.some((r) => r.version === "0.2.0-alpha.240")).toBe(false);
    expect(result.some((r) => r.version === "0.2.0-alpha.239")).toBe(true);
  });
});
