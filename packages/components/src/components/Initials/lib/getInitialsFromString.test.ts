import { getInitialsFromString } from "./getInitialsFromString";

describe('"getInitialsFromString()', () => {
  test("does return empty array if string is empty", () => {
    expect(getInitialsFromString("")).toStrictEqual([]);
  });

  test("does return first character of the first two words", () => {
    expect(getInitialsFromString("foo bar baz")).toStrictEqual(["F", "B"]);
  });

  test("does return one character if only one word is given", () => {
    expect(getInitialsFromString("foo")).toStrictEqual(["F"]);
  });
});
