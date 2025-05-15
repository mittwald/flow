import { describe, expect, test } from "vitest";
import { getColumns } from "./getColumns";

describe('"getColumns()', () => {
  test.each([
    [[1], "1fr"],
    [[1, 2, 3], "1fr 2fr 3fr"],
  ])("builds correct columns for %o", (value, expectedResult) => {
    expect(getColumns(value)).toBe(expectedResult);
  });
});
