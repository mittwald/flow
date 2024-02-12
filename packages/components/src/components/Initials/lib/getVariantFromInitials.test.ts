import { getVariantFromString } from "./getVariantFromString";

describe('"getVariantFromInitials()', () => {
  test("does return 1 if array is empty", () => {
    expect(getVariantFromString("")).toStrictEqual(1);
  });

  test.each([
    ["A", 2],
    ["AB", 4],
    ["B", 3],
    ["C", 4],
    ["Z", 3],
    ["Ä", 1],
    ["1", 2],
  ])("does get correct variant for given initial", (item, expectedVariant) => {
    expect(getVariantFromString(item)).toBe(expectedVariant);
  });
});
