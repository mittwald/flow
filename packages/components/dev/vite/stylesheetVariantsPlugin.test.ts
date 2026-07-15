import { test, expect, describe } from "vitest";
import { stripCascadeLayers } from "./stylesheetVariantsPlugin";

describe("stylesheet variants plugin", () => {
  test("unwraps block layer contents", () => {
    const result = stripCascadeLayers(
      "@layer flow.components { .flow--x { color: red } }",
    );

    expect(result).toContain(".flow--x { color: red }");
    expect(result).not.toContain("@layer");
  });

  test("removes statement layer declarations", () => {
    const result = stripCascadeLayers("@layer a, b;\n.foo { color: red }");

    expect(result).toBe(".foo { color: red }");
  });

  test("preserves nested layer contents inside media queries", () => {
    const result = stripCascadeLayers(
      "@media (min-width: 40rem) { @layer flow.tokens { :root { --x: 1 } } }",
    );

    expect(result).toContain("@media (min-width: 40rem)");
    expect(result).toContain(":root { --x: 1 }");
    expect(result).not.toContain("@layer");
  });
});
