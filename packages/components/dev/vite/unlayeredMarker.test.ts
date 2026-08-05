import { test, expect, describe } from "vitest";
import postcss from "postcss";
import { unlayeredMarkerPlugin } from "./unlayeredMarker";

const process = (
  css: string,
  from = "/abs/src/components/CodeEditor/CodeEditor.module.scss",
) => postcss([unlayeredMarkerPlugin()]).process(css, { from });

describe("unlayered marker plugin", () => {
  test("unwraps the marker without introducing a layer", async () => {
    const result = await process(
      "@layer flow.unlayered { :global(.cm-line) { color: red; } }",
    );

    expect(result.css).not.toContain("@layer");
    expect(result.css).toContain(":global(.cm-line) { color: red; }");
  });

  test("keeps the surrounding rules and their order", async () => {
    const result = await process(
      ".codeEditor { color: red; }" +
        "@layer flow.unlayered { :global(.cm-line) { color: blue; } }" +
        ".copyButton { color: green; }",
    );

    expect(result.css).not.toContain("@layer");
    expect(result.css.indexOf(".codeEditor")).toBeLessThan(
      result.css.indexOf(":global(.cm-line)"),
    );
    expect(result.css.indexOf(":global(.cm-line)")).toBeLessThan(
      result.css.indexOf(".copyButton"),
    );
  });

  test("keeps other layers untouched", async () => {
    const css = "@layer flow.components { .codeEditor { color: red; } }";
    const result = await process(css);

    expect(result.css).toBe(css);
  });

  test("keeps at rules nested inside the marker inside it", async () => {
    const result = await process(
      "@layer flow.unlayered { @media (min-width: 40rem) { :global(.cm-line) { color: red; } } }",
    );

    expect(result.css).not.toContain("@layer");
    expect(result.css).toContain("@media (min-width: 40rem)");
  });

  test("rejects a marker nested inside another at rule", async () => {
    await expect(
      process(
        "@media (min-width: 40rem) { @layer flow.unlayered { :global(.cm-line) { color: red; } } }",
      ),
    ).rejects.toThrow(/flow\.unlayered.*top level/is);
  });

  test("leaves the marker to the layer plugin when that is in the pipeline", async () => {
    const css = "@layer flow.unlayered { :global(.cm-line) { color: red; } }";
    const result = await postcss([
      unlayeredMarkerPlugin(),
      { postcssPlugin: "flow-components-layer", Once: () => undefined },
    ]).process(css, {
      from: "/abs/src/components/CodeEditor/CodeEditor.module.scss",
    });

    expect(result.css).toBe(css);
  });

  test("leaves non-component styles to the build assertion", async () => {
    const css = "@layer flow.unlayered { .globals { color: red; } }";
    const result = await process(css, "/abs/src/styles/globals.scss");

    expect(result.css).toBe(css);
  });
});
