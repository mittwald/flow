import React from "react";
import { getVariantFromChildren } from "./getVariantFromChildren";

describe('"getVariantFromChildren()', () => {
  test.each([
    ["A", 4],
    ["AB", 2],
    [<>Max Mustermann</>, 3],
    [<>Peter Mustermann</>, 1],
  ])("does get correct variant for given children", (item, expectedVariant) => {
    expect(getVariantFromChildren(item)).toBe(expectedVariant);
  });
});
