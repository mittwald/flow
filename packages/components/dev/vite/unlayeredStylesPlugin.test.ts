import postcss from "postcss";
import { describe, expect, test } from "vitest";
import { unlayeredMarkerPlugin } from "./unlayeredMarker";
import { unlayeredStylesPlugin } from "./unlayeredStylesPlugin";

const process = (css: string, from = "/src/styles/index.scss") =>
  postcss([unlayeredMarkerPlugin(), unlayeredStylesPlugin()]).process(css, {
    from,
  }).css;

describe("unlayeredStylesPlugin", () => {
  test("flattens a layer block, keeping its rules in source order", () => {
    const css = process(
      `@layer flow.tokens { :root { --a: 1px; } }\n` +
        `@layer flow.reset { body { margin: 0; } }`,
    );

    expect(css).not.toContain("@layer");
    expect(css.indexOf(":root")).toBeLessThan(css.indexOf("body"));
  });

  test("drops a layer order statement", () => {
    expect(
      process(`@layer flow.tokens, flow.reset;\na { color: red; }`).trim(),
    ).toBe(`a { color: red; }`);
  });

  test("flattens nested layers", () => {
    expect(
      process(`@layer flow { @layer components { a { color: red; } } }`),
    ).not.toContain("@layer");
  });

  test("leaves a component module's lifted marker alone", () => {
    const css = process(
      `@layer flow.unlayered { a { color: red; } }`,
      "/src/components/Button/Button.module.scss",
    );

    expect(css).toContain("a { color: red; }");
    expect(css).not.toContain("@layer");
  });
});
