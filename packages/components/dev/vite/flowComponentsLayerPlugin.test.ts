import { test, expect, describe } from "vitest";
import postcss from "postcss";
import { flowComponentsLayerPlugin } from "./flowComponentsLayerPlugin";
import { unlayeredMarkerPlugin } from "./unlayeredMarker";

/**
 * Every rule of the processed stylesheet in source order, each with the params
 * of the `@layer` at rules it is nested in (outermost first). An empty `layers`
 * array means the rule is unlayered.
 */
const layerPathsOf = (css: string) => {
  const rules: { selector: string; layers: string[] }[] = [];

  postcss.parse(css).walkRules((rule) => {
    const layers: string[] = [];

    for (
      let parent = rule.parent;
      parent && parent.type !== "root";
      parent = parent.parent
    ) {
      if (parent.type === "atrule" && parent.name === "layer") {
        layers.unshift(parent.params);
      }
    }

    rules.push({ selector: rule.selector, layers });
  });

  return rules;
};

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

  describe("unlayered escape hatch", () => {
    const process = (css: string) =>
      postcss([flowComponentsLayerPlugin()]).process(css, {
        from: "/abs/src/components/CodeEditor/CodeEditor.module.scss",
      });

    test("lifts unlayered rules out of the components layer", async () => {
      const result = await process(
        "@layer flow.unlayered { .codeMirror :global(.cm-gutters) { color: red; } }",
      );

      expect(layerPathsOf(result.css)).toEqual([
        { selector: ".codeMirror :global(.cm-gutters)", layers: [] },
      ]);
    });

    test("removes the marker at rule", async () => {
      const result = await process(
        "@layer flow.unlayered { :global(.cm-line) { color: red; } }",
      );

      expect(result.css).not.toContain("flow.unlayered");
    });

    test("keeps the surrounding rules in the components layer", async () => {
      const result = await process(
        ".codeEditor { color: red; }" +
          "@layer flow.unlayered { :global(.cm-line) { color: blue; } }" +
          ".copyButton { color: green; }",
      );

      expect(layerPathsOf(result.css)).toEqual([
        { selector: ".codeEditor", layers: ["flow.components"] },
        { selector: ":global(.cm-line)", layers: [] },
        { selector: ".copyButton", layers: ["flow.components"] },
      ]);
    });

    test("preserves source order across several markers", async () => {
      const result = await process(
        "@layer flow.unlayered { .a { color: red; } }" +
          ".b { color: blue; }" +
          "@layer flow.unlayered { .c { color: green; } }",
      );

      expect(layerPathsOf(result.css).map((rule) => rule.selector)).toEqual([
        ".a",
        ".b",
        ".c",
      ]);
    });

    test("keeps at rules nested inside the marker inside it", async () => {
      const result = await process(
        "@layer flow.unlayered { @media (min-width: 40rem) { :global(.cm-line) { color: red; } } }",
      );

      expect(result.css).toContain("@media (min-width: 40rem)");
      expect(layerPathsOf(result.css)).toEqual([
        { selector: ":global(.cm-line)", layers: [] },
      ]);
    });

    test("rejects a marker nested inside another at rule", async () => {
      await expect(
        process(
          "@media (min-width: 40rem) { @layer flow.unlayered { :global(.cm-line) { color: red; } } }",
        ),
      ).rejects.toThrow(/flow\.unlayered.*top level/is);
    });

    test("still segments when the marker plugin runs ahead of it", async () => {
      const result = await postcss([
        unlayeredMarkerPlugin(),
        flowComponentsLayerPlugin(),
      ]).process(
        ".codeEditor { color: red; }" +
          "@layer flow.unlayered { :global(.cm-line) { color: blue; } }",
        { from: "/abs/src/components/CodeEditor/CodeEditor.module.scss" },
      );

      expect(layerPathsOf(result.css)).toEqual([
        { selector: ".codeEditor", layers: ["flow.components"] },
        { selector: ":global(.cm-line)", layers: [] },
      ]);
    });

    test("leaves a marker in non-component styles to the build assertion", async () => {
      const css = "@layer flow.unlayered { .globals { color: red; } }";
      const result = await postcss([flowComponentsLayerPlugin()]).process(css, {
        from: "/abs/src/styles/globals.scss",
      });

      expect(result.css).toBe(css);
    });
  });
});
