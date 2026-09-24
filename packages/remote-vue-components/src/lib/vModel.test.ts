import { applyModelModifiers, createModelResolver } from "@/lib/vModel";
import { describe, expect, test } from "vitest";

const element = (properties: string[], events: string[]) =>
  createModelResolver(
    new Map(properties.map((p) => [p, {}])),
    new Map(events.map((e) => [e, {}])),
  );

describe("createModelResolver", () => {
  test.each([
    ["value", ["value", "defaultValue"], ["change"], "change"],
    ["isSelected", ["isSelected", "defaultSelected"], ["change"], "change"],
    ["isOpen", ["isOpen", "defaultOpen"], ["openChange"], "openChange"],
    ["is-open", ["isOpen", "defaultOpen"], ["openChange"], "openChange"],
    [
      "selectedKey",
      ["selectedKey", "defaultSelectedKey"],
      ["selectionChange", "change"],
      "selectionChange",
    ],
    [
      "inputValue",
      ["inputValue", "defaultInputValue"],
      ["inputChange", "change"],
      "inputChange",
    ],
    [
      "expandedKeys",
      ["expandedKeys", "defaultExpandedKeys"],
      ["expandedChange"],
      "expandedChange",
    ],
  ])("v-model:%s reports through the element's event", (arg, p, e, event) => {
    expect(element(p, e).resolve(arg)?.event).toBe(event);
  });

  test("a prop without a default sibling is not controllable", () => {
    expect(element(["label"], ["change"]).resolve("label")).toBeUndefined();
  });

  test("a prop whose change the element does not report is not bound", () => {
    expect(
      element(["isExpanded", "defaultExpanded"], ["change"]).resolve(
        "isExpanded",
      ),
    ).toBeUndefined();
  });

  test("a bare v-model takes value before isSelected", () => {
    const resolver = element(
      ["value", "defaultValue", "isSelected", "defaultSelected"],
      ["change"],
    );
    expect(resolver.resolve("modelValue")?.property).toBe("value");
    expect(
      element(["isSelected", "defaultSelected"], ["change"]).resolve(
        "modelValue",
      )?.property,
    ).toBe("isSelected");
  });
});

describe("applyModelModifiers", () => {
  test("trims and casts strings, like Vue's emit", () => {
    expect(applyModelModifiers(" 4.5 ", { trim: true, number: true })).toBe(
      4.5,
    );
    expect(applyModelModifiers("abc", { number: true })).toBe("abc");
    expect(applyModelModifiers(true, { trim: true })).toBe(true);
  });
});
