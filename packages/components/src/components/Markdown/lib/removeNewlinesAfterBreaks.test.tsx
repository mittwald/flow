import { describe, expect, test } from "vitest";
import { removeNewlinesAfterBreaks } from "./removeNewlinesAfterBreaks";

describe("removeNewlinesAfterBreaks", () => {
  test("removes the newline that follows a break", () => {
    const [first, , second] = removeNewlinesAfterBreaks([
      "Line one",
      <br key="br" />,
      "\nline two",
    ]);

    expect(first).toBe("Line one");
    expect(second).toBe("line two");
  });

  test("keeps newlines that follow no break", () => {
    expect(removeNewlinesAfterBreaks(["Line one\nline two"])).toEqual([
      "Line one\nline two",
    ]);
  });

  test("removes only the first newline after a break", () => {
    const [, , rest] = removeNewlinesAfterBreaks([
      "a",
      <br key="br" />,
      "\n\nb",
    ]);

    expect(rest).toBe("\nb");
  });
});
