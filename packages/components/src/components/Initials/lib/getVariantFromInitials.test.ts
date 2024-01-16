import { getVariantFromInitials } from "./getVariantFromInitials";

describe('"getVariantFromInitials()', () => {
  test("does return 1 if array is empty", () => {
    expect(getVariantFromInitials([])).toStrictEqual(1);
  });

  test.each([
    [["A"], 2],
    [["B"], 3],
    [["C", "D"], 4],
    [["Z"], 3],
    [["Ä"], 1],
    [["1"], 2],
  ])("does get correct variant for given initial", (item, expectedVariant) => {
    expect(getVariantFromInitials(item)).toBe(expectedVariant);
  });
});
