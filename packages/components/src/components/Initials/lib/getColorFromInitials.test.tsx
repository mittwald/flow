import { getColorFromInitials } from "./getColorFromInitials";
import { describe, expect, test } from "vitest";

describe('"getColorFromInitials()', () => {
  test.each([
    ["Max Mustermann", "blue"],
    ["Tom", "navy"],
    ["Luke Skywalker", "lilac"],
    ["Ida", "sage"],
    ["Han Solo", "salmon"],
  ])("does get correct color for given children", (item, expectedColor) => {
    expect(getColorFromInitials(item)).toBe(expectedColor);
  });
});
