import { test, expect, describe } from "vitest";
import {
  assertNoUnlayeredMarkers,
  stripCascadeLayers,
} from "./stylesheetVariantsPlugin";

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

  describe("unlayered marker assertion", () => {
    test("rejects a marker that survived into the layered stylesheet", () => {
      expect(() =>
        assertNoUnlayeredMarkers(
          "@layer flow.unlayered { :global(.cm-line) { color: red } }",
          "css/all-layered.css",
        ),
      ).toThrow(/flow\.unlayered/);
    });

    test("names the offending selector so the source is findable", () => {
      expect(() =>
        assertNoUnlayeredMarkers(
          "@layer flow.unlayered { .cm-line { color: red } }",
          "css/all-layered.css",
        ),
      ).toThrow(/\.cm-line/);
    });

    test("rejects a marker with unusual whitespace", () => {
      expect(() =>
        assertNoUnlayeredMarkers(
          "@layer   flow.unlayered   { .a { color: red } }",
          "css/all-layered.css",
        ),
      ).toThrow(/flow\.unlayered/);
    });

    test("rejects a marker nested inside a media query", () => {
      expect(() =>
        assertNoUnlayeredMarkers(
          "@media (min-width: 40rem) { @layer flow.unlayered { .a { color: red } } }",
          "css/all-layered.css",
        ),
      ).toThrow(/flow\.unlayered/);
    });

    test("accepts a stylesheet without markers", () => {
      expect(() =>
        assertNoUnlayeredMarkers(
          "@layer flow.components { .flow--button { color: red } }\n.cm-line { color: blue }",
          "css/all-layered.css",
        ),
      ).not.toThrow();
    });

    test("ignores the marker name in a comment", () => {
      expect(() =>
        assertNoUnlayeredMarkers(
          "/* lifted out of flow.unlayered */\n.a { color: red }",
          "css/all-layered.css",
        ),
      ).not.toThrow();
    });
  });
});
