import { describe, expect, test } from "vitest";
import { toRelativePathname } from "@/connection/toRelativePathname";

describe("toRelativePathname", () => {
  test("keeps normalized relative paths", () => {
    expect(toRelativePathname("/a/b?x=1#h")).toBe("/a/b?x=1#h");
  });

  test.each([
    "https://other.example",
    "//other.example",
    "/\\other.example",
    "javascript:alert(1)",
    " /x",
    1,
    null,
  ])("rejects %p", (value) => {
    expect(toRelativePathname(value)).toBeUndefined();
  });
});
