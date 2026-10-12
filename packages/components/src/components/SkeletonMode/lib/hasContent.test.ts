import { createElement } from "react";
import { describe, expect, test } from "vitest";
import { hasContent } from "./hasContent";

const RemoteText = () => null;
const remoteText = (data: string) =>
  createElement(RemoteText, { remote: { data } } as object);

describe("hasContent", () => {
  test.each([
    ["undefined", undefined],
    ["null", null],
    ["false", false],
    ["true", true],
    ["an empty string", ""],
    ["an empty array", []],
    ["an array of empty values", [null, false, "", undefined]],
    ["an empty remote text", remoteText("")],
  ])("is false for %s", (_, children) => {
    expect(hasContent(children)).toBe(false);
  });

  test.each([
    ["text", "example-domain.de"],
    ["a number", 0],
    ["an element", createElement("span")],
    ["an array with text", [null, "example-domain.de"]],
    ["a remote text", remoteText("example-domain.de")],
  ])("is true for %s", (_, children) => {
    expect(hasContent(children)).toBe(true);
  });
});
