import type { ComponentDoc } from "react-docgen-typescript";
import { describe, expect, test } from "vitest";
import { generateRemoteVueComponentFile } from "../generation/generateRemoteVueComponentFile";
import { isBoolean, unionMembers } from "./propClassifiers";

/* Type names as react-docgen-typescript prints them in `doc-properties.json`. */
const componentDoc = (props: Record<string, string>): ComponentDoc =>
  ({
    displayName: "Example",
    description: "",
    filePath: "src/components/Example/Example.tsx",
    tags: {},
    props: Object.fromEntries(
      Object.entries(props).map(([name, type]) => [
        name,
        { name, required: false, description: "", type: { name: type } },
      ]),
    ),
  }) as unknown as ComponentDoc;

describe("unionMembers", () => {
  test.each([
    ["boolean", ["boolean"]],
    [
      'boolean | "horizontal" | "vertical"',
      ["boolean", '"horizontal"', '"vertical"'],
    ],
    ["boolean | (() => boolean)", ["boolean", "() => boolean"]],
    ["(boolean | null)", ["boolean", "null"]],
    ["((element: Element) => boolean)", ["(element: Element) => boolean"]],
    ["() => string | boolean", ["() => string | boolean"]],
    ['"a | boolean" | number', ['"a | boolean"', "number"]],
    [
      "Map<string, boolean | number> | string",
      ["Map<string, boolean | number>", "string"],
    ],
  ])("%s", (type, members) => {
    expect(unionMembers(type)).toEqual(members);
  });
});

describe("isBoolean", () => {
  const component = componentDoc({
    isDisabled: "boolean",
    allowResize: 'boolean | "horizontal" | "vertical"',
    truncateLines: "number | boolean",
    shouldCloseOnSelect: "boolean | (() => boolean)",
    skipHtml: "boolean | null",
    shouldCloseOnInteractOutside: "((element: Element) => boolean)",
    isValid: "() => boolean",
    flags: "boolean[]",
    label: "string",
    onPress: "boolean",
  });

  test.each([
    "isDisabled",
    "allowResize",
    "truncateLines",
    "shouldCloseOnSelect",
    "skipHtml",
  ])("%s takes a boolean", (prop) => {
    expect(isBoolean(component, prop)).toBe(true);
  });

  test.each([
    "shouldCloseOnInteractOutside",
    "isValid",
    "flags",
    "label",
    "onPress",
  ])("%s does not", (prop) => {
    expect(isBoolean(component, prop)).toBe(false);
  });
});

test("the Vue file lists a union containing boolean among its booleans", () => {
  const file = generateRemoteVueComponentFile(
    componentDoc({
      allowResize: 'boolean | "horizontal" | "vertical"',
      truncateLines: "number | boolean",
      label: "string",
    }),
  );
  expect(file).toContain('booleans: ["allowResize", "truncateLines"]');
});
