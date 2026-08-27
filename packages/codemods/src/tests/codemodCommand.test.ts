import { describe, expect, test } from "vitest";
import { resolveSourcePath } from "../cli/codemod";

describe("resolveSourcePath", () => {
  test("an explicit path wins", () => {
    expect(resolveSourcePath("app", "/project", () => true)).toBe("app");
  });

  test("src is the default when it exists", () => {
    expect(
      resolveSourcePath(undefined, "/project", (path) => path.endsWith("src")),
    ).toBe("src");
  });

  test("the working directory is the fallback", () => {
    expect(resolveSourcePath(undefined, "/project", () => false)).toBe(".");
  });
});
