import { test, expect, describe } from "vitest";
import { hoistLayerOrder } from "./layerOrderPlugin";

const layerOrderDeclaration =
  "@layer flow.tokens, flow.reset, flow.base, flow.components;";

const countLayerOrderDeclarations = (css: string) =>
  css.split(layerOrderDeclaration).length - 1;

describe("layer order plugin", () => {
  test("hoists layer order after charset", () => {
    const result = hoistLayerOrder(
      '@charset "UTF-8";\n.foo {}\n@layer flow.tokens, flow.reset, flow.base, flow.components;\n.bar {}',
    );

    expect(result).toBe(
      '@charset "UTF-8";\n@layer flow.tokens, flow.reset, flow.base, flow.components;\n.foo {}\n\n.bar {}',
    );
    expect(countLayerOrderDeclarations(result)).toBe(1);
  });

  test("hoists layer order to the start without charset", () => {
    const result = hoistLayerOrder(
      ".foo {}\n@layer flow.tokens, flow.reset, flow.base, flow.components;\n.bar {}",
    );

    expect(result).toBe(
      "@layer flow.tokens, flow.reset, flow.base, flow.components;\n.foo {}\n\n.bar {}",
    );
    expect(countLayerOrderDeclarations(result)).toBe(1);
  });

  test("deduplicates layer order declarations", () => {
    const result = hoistLayerOrder(
      "@layer flow.tokens, flow.reset, flow.base, flow.components;\n.foo {}\n@layer flow.tokens, flow.reset, flow.base, flow.components;",
    );

    expect(result).toBe(
      "@layer flow.tokens, flow.reset, flow.base, flow.components;\n.foo {}\n",
    );
    expect(countLayerOrderDeclarations(result)).toBe(1);
  });
});
