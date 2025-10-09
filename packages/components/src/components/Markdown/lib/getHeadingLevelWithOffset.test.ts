import { describe, expect, test } from "vitest";
import { getHeadingLevelWithOffset } from "@/components/Markdown/lib/getHeadingLevelWithOffset";

describe('"getHeadingLevelWithOffset()', () => {
  test.each([
    [1, 2, 3],
    [1, -1, 1],
    [4, 3, 6],
  ])("does get correct level with offset", (level, offset, expectedLevel) => {
    expect(getHeadingLevelWithOffset(level, offset)).toBe(expectedLevel);
  });
});
