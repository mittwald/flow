import { selectRequestedTargets } from "./crossVersionRunner";
import { describe, expect, it } from "vitest";

const targets = [
  { category: "previous", version: "1.0.10" },
  { category: "firstOfLine", version: "1.0.0" },
  { category: "latestOfPreviousLine", version: "0.2.0-alpha.1058" },
];

describe("selectRequestedTargets", () => {
  it("runs every target when nothing is requested", () => {
    expect(selectRequestedTargets(targets, undefined)).toEqual(targets);
    expect(selectRequestedTargets(targets, "")).toEqual(targets);
    expect(selectRequestedTargets(targets, "  ")).toEqual(targets);
  });

  it("selects by category", () => {
    expect(selectRequestedTargets(targets, "firstOfLine")).toEqual([
      targets[1],
    ]);
  });

  it("selects by version", () => {
    expect(selectRequestedTargets(targets, "0.2.0-alpha.1058")).toEqual([
      targets[2],
    ]);
  });

  it("selects several, however they are spaced", () => {
    expect(selectRequestedTargets(targets, "previous, 1.0.0")).toEqual([
      targets[0],
      targets[1],
    ]);
  });

  it("names a target once, even when asked for twice", () => {
    expect(selectRequestedTargets(targets, "previous,1.0.10")).toEqual([
      targets[0],
    ]);
  });

  /*
   * The matrix runs one job per target. A job whose target the manifest no
   * longer holds — a publish gap, a category the alpha fallback renamed — must
   * fail rather than report a pass over an empty selection.
   */
  it("fails on a target the manifest does not hold", () => {
    expect(() => selectRequestedTargets(targets, "previous,2.0.0")).toThrow(
      /no target "2\.0\.0"/,
    );
  });
});
