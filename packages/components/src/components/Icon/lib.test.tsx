import { extractSvgFromString } from "./lib";
import React from "react";

describe('"extractSvgFromString()', () => {
  test("does return svg if string contains an svg", () => {
    expect(
      extractSvgFromString(
        '<svg viewBox="0 0 1746.7 1232"><path d="M1117.2,285.4c-102.5,0-226.5"/></svg>',
      )?.toString(),
    ).toEqual(
      (
        <svg viewBox="0 0 1746.7 1232">
          <path d="M1117.2,285.4c-102.5,0-226.5" />
        </svg>
      ).toString(),
    );
  });
  test("does return svg if string contains an svg with additional elements", () => {
    expect(
      extractSvgFromString(
        '<?xml version="1.0" encoding="UTF-8"?><svg viewBox="0 0 1746.7 1232"><path d="M1117.2,285.4c-102.5,0-226.5"/></svg>',
      )?.toString(),
    ).toEqual(
      (
        <svg viewBox="0 0 1746.7 1232">
          <path d="M1117.2,285.4c-102.5,0-226.5" />
        </svg>
      ).toString(),
    );
  });
  test("does throw error if string does not contain an svg", () => {
    expect(() => extractSvgFromString("<div></div>")).toThrowError();
  });
});
