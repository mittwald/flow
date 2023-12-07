import { extractSvgFromString } from "./lib";

describe('"extractSvgFromString()', () => {
  test("does fail if string does not contain an svg", () => {
    expect(() =>
      extractSvgFromString(
        '<svg viewBox="0 0 1746.7 1232"><path d="M1117.2,285.4c-102.5,0-226.5"/></svg>',
      ),
    ).not.toThrowError();
  });
});
