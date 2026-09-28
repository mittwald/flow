import { describe, expect, test } from "vitest";
import { areChildrenEmpty } from "./areChildrenEmpty";

describe("areChildrenEmpty", () => {
  test.each([undefined, null, false])("%o is empty", (children) => {
    expect(areChildrenEmpty(children)).toBe(true);
  });

  test("an empty array is empty", () => {
    expect(areChildrenEmpty([])).toBe(true);
  });

  /*
   * What a conditional render leaves behind: `{cond && <Foo />}` and friends
   * collapse to `false`/`null`, so an array of only those is an empty slot, not
   * a filled one.
   */
  test("an array of only nullish children is empty", () => {
    expect(areChildrenEmpty([null, false, undefined])).toBe(true);
  });

  test("an array is not empty as soon as one child survives", () => {
    expect(areChildrenEmpty([null, <span key="a" />, false])).toBe(false);
  });

  test("an element is not empty", () => {
    expect(areChildrenEmpty(<span />)).toBe(false);
  });

  test.each(["text", 0, "", true])("%o is not empty", (children) => {
    expect(areChildrenEmpty(children)).toBe(false);
  });
});
