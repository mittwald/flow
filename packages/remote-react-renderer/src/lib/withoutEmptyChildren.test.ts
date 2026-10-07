import { describe, expect, test } from "vitest";
import { withoutEmptyChildren } from "@/lib/withoutEmptyChildren";

describe("withoutEmptyChildren", () => {
  test("drops an empty children array", () => {
    expect(withoutEmptyChildren({ value: 1, children: [] })).toEqual({
      value: 1,
    });
  });

  test("keeps non-empty children", () => {
    const props = { children: ["text"] };
    expect(withoutEmptyChildren(props)).toBe(props);
  });

  test("keeps props without children", () => {
    const props = { value: 1 };
    expect(withoutEmptyChildren(props)).toBe(props);
  });
});
