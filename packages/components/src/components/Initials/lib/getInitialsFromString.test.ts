import { getInitialsFromString } from "./getInitialsFromString";

describe('"getInitialsFromString()', () => {
  test("does return empty array if string is empty", () => {
    expect(getInitialsFromString("")).toStrictEqual([]);
  });

  test.each([
    ["Max Mustermann", "MM"],
    ["Max & (Mustermann)", "MM"],
    ["Max", "M"],
  ])("builds correct initials for %o", (item, expectedResult) => {
    expect(getInitialsFromString(item).join("")).toBe(expectedResult);
  });
});
