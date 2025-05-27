import { getColorFromInitials } from "./getColorFromInitials";
import { describe, expect, test } from "vitest";

describe('"getColorFromInitials()', () => {
  test.each([
    ["A", "teal"],
    ["AH", "violet"],
    ["Max Mustermann", "blue"],
    ["Peter Mustermann", "green"],
  ])("does get correct color for given children", (item, expectedColor) => {
    expect(getColorFromInitials(item)).toBe(expectedColor);
  });
});
