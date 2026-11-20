import { describe, expect, test } from "vitest";
import contentColored from "./contentColor";
import resolveDynamicProps from "./dynamicProps/resolveDynamicProps";

const colored = contentColored("dark");

describe("contentColored", () => {
  test("colors InlineCode", () => {
    expect(colored.InlineCode).toEqual({ color: "dark" });
  });

  test.each([
    [undefined, "dark"],
    ["neutral", "dark"],
    ["danger", "danger"],
  ] as const)("maps Badge color %s to %s", (color, expected) => {
    expect(
      resolveDynamicProps<"Badge">(colored.Badge ?? {}, { color }),
    ).toEqual({
      color: expected,
    });
  });

  test.each([
    [undefined, undefined],
    ["secondary", "dark"],
    ["danger", "danger"],
  ] as const)("maps Button color %s to %s", (color, expected) => {
    expect(
      resolveDynamicProps<"Button">(colored.Button ?? {}, { color }).color,
    ).toBe(expected);
  });

  test.each([
    [undefined, "dark"],
    ["secondary", "dark"],
    ["danger", "danger"],
  ] as const)("maps CopyButton color %s to %s", (color, expected) => {
    expect(
      resolveDynamicProps<"CopyButton">(colored.CopyButton ?? {}, { color }),
    ).toEqual({ color: expected });
  });

  test("repeats the entries below Text", () => {
    const { Text, ...entries } = colored;
    expect(Text).toEqual(entries);
  });

  test("returns the same context for the same color", () => {
    expect(contentColored("dark")).toBe(colored);
    expect(contentColored("light")).not.toBe(colored);
  });
});
