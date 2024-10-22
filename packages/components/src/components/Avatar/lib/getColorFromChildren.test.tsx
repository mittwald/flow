import React from "react";
import { getColorFromChildren } from "./getColorFromChildren";
import { describe, expect, test } from "vitest";

describe('"getColorFromChildren()', () => {
  test.each([
    ["A", "violet"],
    ["AB", "teal"],
    [<>Max Mustermann</>, "green"],
    [<>Peter Mustermann</>, "blue"],
  ])("does get correct color for given children", (item, expectedColor) => {
    expect(getColorFromChildren(item)).toBe(expectedColor);
  });
});
