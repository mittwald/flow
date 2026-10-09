import { parseSvg } from "./svg";
import { describe, expect, test } from "vitest";

describe("parseSvg", () => {
  test("reads an element, its attributes and its children", () => {
    const root = parseSvg(`
      <svg viewBox="0 0 24 24" fill="none">
        <path d="M1 2" />
        <circle cx="3" cy="4" r="5"></circle>
      </svg>
    `);

    expect(root.tag).toBe("svg");
    expect(root.attributes).toEqual({ viewBox: "0 0 24 24", fill: "none" });
    expect(root.children.map((child) => child.tag)).toEqual(["path", "circle"]);
    expect(root.children[1]?.attributes).toEqual({
      cx: "3",
      cy: "4",
      r: "5",
    });
  });

  test("nests", () => {
    const root = parseSvg(`<svg><g><path d="M1 2" /></g></svg>`);

    expect(root.children[0]?.children[0]?.attributes).toEqual({ d: "M1 2" });
  });

  /*
   * `icons.yaml` writes its custom icons as JSX, so the React generator can
   * inline them — and JSX spells the presentation attributes React's way. An
   * SVG element ignores `strokeWidth`, so getting this wrong renders the icon
   * without its stroke rather than failing.
   */
  test("gives React's attribute names back their SVG spelling", () => {
    const root = parseSvg(
      `<svg viewBox="0 0 1 1"><path strokeWidth="1.5" fillOpacity="0.5" /></svg>`,
    );

    expect(root.attributes).toEqual({ viewBox: "0 0 1 1" });
    expect(root.children[0]?.attributes).toEqual({
      "stroke-width": "1.5",
      "fill-opacity": "0.5",
    });
  });

  test("keeps the attributes that are camelCase in SVG itself", () => {
    const root = parseSvg(
      `<svg viewBox="0 0 1 1" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg" />`,
    );

    expect(root.attributes.preserveAspectRatio).toBe("none");
    expect(root.attributes.viewBox).toBe("0 0 1 1");
  });

  /*
   * Pins the property CodeQL asked for after flagging the first version
   * (js/polynomial-redos): the scanner reads one token at one position, so
   * input it cannot complete costs one pass, not a quadratic one.
   *
   * It does not reproduce the old failure — that version matched a whole tag at
   * once and rejected this input before its quadratic attribute scan ever ran.
   * What it guards is the new scanner, where the `!` run *is* read, as an
   * attribute name that then has no `=`.
   */
  test.each([
    ["an attribute name that never ends", `<svg ${"!".repeat(50_000)}`],
    ["whitespace where a value should be", `<svg a${" ".repeat(50_000)}`],
    ["whitespace inside a closing tag", `<svg></svg${" ".repeat(50_000)}`],
  ])("gives up in linear time on %s", (ignoredWhat, markup) => {
    const startedAt = performance.now();
    expect(() => parseSvg(markup)).toThrow();
    expect(performance.now() - startedAt).toBeLessThan(1000);
  });

  /*
   * Strict on purpose: a parser that skipped what it did not understand would
   * drop a path and generate an icon that renders nothing, with the generator
   * reporting success.
   */
  test.each([
    ["text content", `<svg>hello</svg>`],
    ["an unclosed element", `<svg><path d="M1 2"></svg>`],
    ["a stray close tag", `<svg></path></svg>`],
    ["single-quoted attributes", `<svg viewBox='0 0 1 1' />`],
    ["two roots", `<svg /><svg />`],
  ])("refuses %s", (ignoredWhat, markup) => {
    expect(() => parseSvg(markup)).toThrow();
  });
});
