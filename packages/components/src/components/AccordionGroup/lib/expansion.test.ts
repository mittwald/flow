import { describe, expect, test } from "vitest";
import {
  expandedKeysOf,
  initialExpansion,
  isKeyExpanded,
  nextExpandedKeys,
  setKeyExpanded,
} from "./expansion";

describe("isKeyExpanded", () => {
  test("follows the accordion's own default and the group's default keys", () => {
    const expansion = initialExpansion(["b"]);

    expect(isKeyExpanded(expansion, "a", true)).toBe(true);
    expect(isKeyExpanded(expansion, "b", false)).toBe(true);
    expect(isKeyExpanded(expansion, "c", false)).toBe(false);
  });

  test("an explicit change wins over the default", () => {
    const expansion = setKeyExpanded(initialExpansion(), "a", false, true);

    expect(isKeyExpanded(expansion, "a", true)).toBe(false);
  });
});

describe("setKeyExpanded", () => {
  test("keeps the other accordions when several may be expanded", () => {
    const expansion = setKeyExpanded(initialExpansion(["b"]), "a", true, true);

    expect(isKeyExpanded(expansion, "a", false)).toBe(true);
    expect(isKeyExpanded(expansion, "b", false)).toBe(true);
  });

  test("collapses every other accordion, default-expanded ones too, in single mode", () => {
    const expansion = setKeyExpanded(initialExpansion(["b"]), "a", true, false);

    expect(isKeyExpanded(expansion, "a", false)).toBe(true);
    expect(isKeyExpanded(expansion, "b", false)).toBe(false);
    expect(isKeyExpanded(expansion, "c", true)).toBe(false);
  });

  test("collapsing in single mode leaves the others untouched", () => {
    const expansion = setKeyExpanded(
      initialExpansion(["b"]),
      "a",
      false,
      false,
    );

    expect(isKeyExpanded(expansion, "b", false)).toBe(true);
  });
});

test("expandedKeysOf reports the expanded keys of the registered accordions", () => {
  const expansion = setKeyExpanded(initialExpansion(["b"]), "c", true, true);
  const registered = new Map([
    ["a", true],
    ["b", false],
    ["c", false],
    ["d", false],
  ]);

  expect(expandedKeysOf(expansion, registered)).toEqual(
    new Set(["a", "b", "c"]),
  );
});

describe("nextExpandedKeys", () => {
  test("adds and removes a key when several may be expanded", () => {
    expect(nextExpandedKeys(new Set(["a"]), "b", true, true)).toEqual(
      new Set(["a", "b"]),
    );
    expect(nextExpandedKeys(new Set(["a", "b"]), "a", false, true)).toEqual(
      new Set(["b"]),
    );
  });

  test("replaces the expanded key in single mode", () => {
    expect(nextExpandedKeys(new Set(["a"]), "b", true, false)).toEqual(
      new Set(["b"]),
    );
  });
});
