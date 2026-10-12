import { describe, expect, test } from "vitest";
import { getColumns } from "./getColumns";

describe('"getColumns()', () => {
  test.each([
    [[1], "minmax(0, 1fr)"],
    [[1, 2, 3], "minmax(0, 1fr) minmax(0, 2fr) minmax(0, 3fr)"],
    [[1, null, 3], "minmax(0, 1fr) minmax(0, 3fr)"],
  ])("builds correct columns for %o", (value, expectedResult) => {
    expect(getColumns(value)).toBe(expectedResult);
  });
});
