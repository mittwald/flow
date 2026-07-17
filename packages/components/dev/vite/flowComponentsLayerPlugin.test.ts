import { test, expect, describe } from "vitest";
import postcss from "postcss";
import { flowComponentsLayerPlugin } from "./flowComponentsLayerPlugin";

describe("flow components layer plugin", () => {
  test("wraps component scss modules in the components layer", async () => {
    const result = await postcss([flowComponentsLayerPlugin()]).process(
      ".flow--button { color: red; }",
      { from: "/abs/src/components/Button/Button.module.scss" },
    );

    expect(result.css).toBe(
      "@layer flow.components {.flow--button { color: red; } }",
    );
  });

  test("wraps component scss modules with Windows paths in the components layer", async () => {
    const result = await postcss([flowComponentsLayerPlugin()]).process(
      ".flow--button { color: red; }",
      { from: "C:\\repo\\src\\components\\Button\\Button.module.scss" },
    );

    expect(result.css).toBe(
      "@layer flow.components {.flow--button { color: red; } }",
    );
  });

  test("wraps component css modules in the components layer", async () => {
    const result = await postcss([flowComponentsLayerPlugin()]).process(
      ".flow--button { color: red; }",
      { from: "/abs/src/components/Button/Button.module.css" },
    );

    expect(result.css).toBe(
      "@layer flow.components {.flow--button { color: red; } }",
    );
  });

  test("leaves non-component styles unchanged", async () => {
    const css = ".globals { color: red; }";
    const result = await postcss([flowComponentsLayerPlugin()]).process(css, {
      from: "/abs/src/styles/globals.scss",
    });

    expect(result.css).toBe(css);
  });
});
