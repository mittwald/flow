import { describe, expect, it } from "vitest";
import { selectCrossVersionTargetVersions } from "./selectTargetVersions";

// A stable released history spanning two minor lines.
const released = ["0.1.0", "0.1.1", "0.1.2", "0.2.0", "0.2.1", "0.2.2"];

describe("selectCrossVersionTargetVersions — semver categories", () => {
  it("selects previous, firstOfLine and latestOfPreviousLine for a released version", () => {
    const result = selectCrossVersionTargetVersions("0.2.2", released);
    const byCategory = Object.fromEntries(
      result.map((r) => [r.category, r.version]),
    );
    expect(byCategory.previous).toBe("0.2.1");
    expect(byCategory.firstOfLine).toBe("0.2.0");
    expect(byCategory.latestOfPreviousLine).toBe("0.1.2");
  });

  it("crosses a major boundary: latestOfPreviousLine is the latest of the previous major", () => {
    // Two majors: 1.x (lines 1.0/1.1/1.2) then 2.x. Current is the first minor
    // line of major 2, so the previous line is the highest line of major 1 —
    // i.e. latestOfPreviousLine must be the latest published 1.x version.
    const acrossMajors = [
      "1.0.0",
      "1.1.0",
      "1.2.0",
      "1.2.1",
      "2.0.0",
      "2.0.1",
      "2.0.2",
    ];
    const result = selectCrossVersionTargetVersions("2.0.2", acrossMajors);
    const byCategory = Object.fromEntries(
      result.map((r) => [r.category, r.version]),
    );
    expect(byCategory.previous).toBe("2.0.1");
    expect(byCategory.firstOfLine).toBe("2.0.0");
    expect(byCategory.latestOfPreviousLine).toBe("1.2.1");
  });

  it("ignores versions at or above the current version", () => {
    const result = selectCrossVersionTargetVersions("0.2.0", released);
    for (const target of result) {
      expect(target.version.startsWith("0.2.")).not.toBe(true);
    }
    // previous of 0.2.0 is the newest below it
    expect(result.find((r) => r.category === "previous")?.version).toBe(
      "0.1.2",
    );
  });

  it("drops categories that cannot resolve (no previous line) without throwing", () => {
    const result = selectCrossVersionTargetVersions("0.1.2", released);
    expect(
      result.find((r) => r.category === "latestOfPreviousLine"),
    ).toBeUndefined();
    expect(result.find((r) => r.category === "previous")?.version).toBe(
      "0.1.1",
    );
  });

  it("de-duplicates versions shared by multiple categories", () => {
    const result = selectCrossVersionTargetVersions("0.2.1", released);
    const versions = result.map((r) => r.version);
    expect(new Set(versions).size).toBe(versions.length);
  });
});

describe("selectCrossVersionTargetVersions — exclusions", () => {
  it("skips an excluded version and steps to the next valid candidate", () => {
    const result = selectCrossVersionTargetVersions("0.2.2", released, [
      "0.2.1",
    ]);
    // previous should now skip the broken 0.2.1 and pick 0.2.0
    expect(result.find((r) => r.category === "previous")?.version).toBe(
      "0.2.0",
    );
    expect(result.some((r) => r.version === "0.2.1")).toBe(false);
  });
});

describe("selectCrossVersionTargetVersions — prereleases", () => {
  // The real shape since the two-line release model: every line opens with a
  // run of `X.Y.0-next.N` on the next branch before `X.Y.0` ships.
  const withNext = [
    "1.1.52",
    "1.1.53",
    "1.2.0-next.0",
    "1.2.0-next.1",
    "1.2.0",
    "1.2.1",
    "1.2.2",
    "1.3.0-next.0",
  ];

  it("never selects a prerelease as a target", () => {
    const result = selectCrossVersionTargetVersions("1.2.2", withNext);
    for (const target of result) {
      expect(target.version).not.toContain("-");
    }
  });

  it("resolves firstOfLine to the line's first stable release, not its first prerelease", () => {
    const result = selectCrossVersionTargetVersions("1.2.2", withNext);
    const byCategory = Object.fromEntries(
      result.map((r) => [r.category, r.version]),
    );
    expect(byCategory.firstOfLine).toBe("1.2.0");
    expect(byCategory.previous).toBe("1.2.1");
    expect(byCategory.latestOfPreviousLine).toBe("1.1.53");
  });

  it("selects stable targets while the current version is itself a prerelease", () => {
    // On the next line: the current line has no stable release yet, so
    // firstOfLine drops and the previous line's latest carries the coverage.
    const result = selectCrossVersionTargetVersions("1.3.0-next.1", withNext);
    const versions = result.map((r) => r.version);
    expect(versions).toEqual(["1.2.2"]);
    expect(result.find((r) => r.category === "firstOfLine")).toBeUndefined();
  });
});

describe("selectCrossVersionTargetVersions — alpha-offset fallback", () => {
  const alpha = Array.from({ length: 250 }, (_, i) => `0.2.0-alpha.${i + 1}`);

  it("falls back to computed offsets when no stable release has been published yet", () => {
    const current = "0.2.0-alpha.250";
    const result = selectCrossVersionTargetVersions(current, alpha, [], {
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
    const result = selectCrossVersionTargetVersions(current, short, [], {
      offsets: [10, 100, 200],
    });
    const versions = result.map((r) => r.version);
    expect(versions).toContain("0.2.0-alpha.240"); // -10 exists
    expect(versions.some((v) => v === "0.2.0-alpha.150")).toBe(false); // -100 gone
  });

  it("honours exclusions in offset mode by stepping to the next older version", () => {
    const current = "0.2.0-alpha.250";
    const result = selectCrossVersionTargetVersions(
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
