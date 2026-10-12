import { describe, expect, test } from "vitest";
import {
  addNestingLevel,
  getNestingLevel,
  isNestingLevelKey,
  isNestingProps,
} from "./lib";
import { nestingLevelKey } from "./types";
import type { PropsContext } from "@/lib/propsContext/types";

describe("isNestingProps", () => {
  test("props carrying a numeric level are nesting props", () => {
    expect(isNestingProps({ [nestingLevelKey]: 0 })).toBe(true);
  });

  test.each([
    { type: "submit" },
    { [nestingLevelKey]: "1" },
    null,
    undefined,
    "Button",
  ])("%o is not", (candidate) => {
    expect(isNestingProps(candidate)).toBe(false);
  });
});

describe("getNestingLevel", () => {
  test("reads the level", () => {
    expect(getNestingLevel({ [nestingLevelKey]: 2 })).toBe(2);
  });

  test("props without a level sit at 0, so they lose against anything nested", () => {
    expect(getNestingLevel({ type: "submit" })).toBe(0);
    expect(getNestingLevel(undefined)).toBe(0);
  });
});

describe("isNestingLevelKey", () => {
  test("recognises the key", () => {
    expect(isNestingLevelKey(nestingLevelKey)).toBe(true);
    expect(isNestingLevelKey("type")).toBe(false);
  });
});

describe("addNestingLevel", () => {
  test("a flat context is level 0", () => {
    expect(addNestingLevel({ Button: { type: "submit" } })).toEqual({
      Button: { type: "submit", [nestingLevelKey]: 0 },
    });
  });

  test("the level counts the contexts, not the props", () => {
    const withLevels = addNestingLevel({
      Button: { type: "submit", Text: { className: "label" } },
    });

    expect(withLevels).toEqual({
      Button: {
        type: "submit",
        [nestingLevelKey]: 0,
        Text: { className: "label", [nestingLevelKey]: 1 },
      },
    });
  });

  test("every component of a level gets the same level", () => {
    expect(
      addNestingLevel({ Button: { type: "submit" }, Text: { rel: "price" } }),
    ).toEqual({
      Button: { type: "submit", [nestingLevelKey]: 0 },
      Text: { rel: "price", [nestingLevelKey]: 0 },
    });
  });

  test("a starting level shifts the whole tree", () => {
    expect(addNestingLevel({ Button: { Text: { rel: "price" } } }, 2)).toEqual({
      Button: {
        [nestingLevelKey]: 2,
        Text: { rel: "price", [nestingLevelKey]: 3 },
      },
    });
  });

  /*
   * Idempotent: a context that already carries its levels is passed through
   * untouched, so re-entering the same provider cannot deepen it.
   */
  test("props that already carry a level are left alone", () => {
    const alreadyLevelled: PropsContext = {
      Button: { type: "submit", [nestingLevelKey]: 5 },
    };

    expect(addNestingLevel(alreadyLevelled)).toEqual(alreadyLevelled);
  });

  test("keys that are not component names are copied as they are", () => {
    expect(
      addNestingLevel({ [nestingLevelKey]: 3, Button: { type: "submit" } }),
    ).toEqual({
      [nestingLevelKey]: 3,
      Button: { type: "submit", [nestingLevelKey]: 0 },
    });
  });

  test("the input is not mutated", () => {
    const context: PropsContext = { Button: { type: "submit" } };

    addNestingLevel(context);

    expect(context).toEqual({ Button: { type: "submit" } });
  });
});
