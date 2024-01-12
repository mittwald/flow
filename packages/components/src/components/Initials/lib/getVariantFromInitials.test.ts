import { getVariantFromInitials } from "./getVariantFromInitials";

describe('"getVariantFromInitials()', () => {
  test("does return 1 if array is empty", () => {
    expect(getVariantFromInitials([])).toStrictEqual(1);
  });

  test.each([[["A"]], [["B"]], [["C", "D"]], [["Z"]], [["Ä"]], [["1"]]])(
    "does return number between 1 and 4 for any given initial",
    (item) => {
      expect(getVariantFromInitials(item)).toBeGreaterThan(0);
      expect(getVariantFromInitials(item)).toBeLessThanOrEqual(4);
    },
  );
});
