import { extractSvgFromString } from "./extractSvgFromString";
import reactElementToJSXString from "react-element-to-jsx-string";
import { describe, expect, test } from "vitest";

const svgAsString =
  '<svg viewBox="0 0 1746.7 1232"><path d="M1117.2,285.4c-102.5,0-226.5"/></svg>';

const formattedSvgString = `\
<svg viewBox="0 0 1746.7 1232">
  <path d="M1117.2,285.4c-102.5,0-226.5" />
</svg>`;

describe('"extractSvgFromString()', () => {
  test("does return SVG if string contains an SVG", () => {
    const reactElement = extractSvgFromString(svgAsString);
    const jsxString = reactElementToJSXString(reactElement);
    expect(jsxString).toBe(formattedSvgString);
  });

  test("does return SVG if string contains an SVG with additional elements", () => {
    const reactElement = extractSvgFromString(
      `<?xml version="1.0" encoding="UTF-8"?>${svgAsString}`,
    );
    const jsxString = reactElementToJSXString(reactElement);
    expect(jsxString).toBe(formattedSvgString);
  });

  test("does throw error if string does not contain an svg", () => {
    expect(() => extractSvgFromString("<div></div>")).toThrowError();
  });
});
