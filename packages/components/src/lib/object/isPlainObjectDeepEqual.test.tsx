import { describe, expect, test } from "vitest";
import { isPlainObjectDeepEqual } from "@/lib/object/isPlainObjectDeepEqual";

describe("isPlainObjectDeepEqual", () => {
  const onPress = () => undefined;

  test("is true for structurally equal plain objects", () => {
    expect(
      isPlainObjectDeepEqual(
        { Button: { color: "dark", onPress, Icon: { size: "s" } } },
        { Button: { color: "dark", onPress, Icon: { size: "s" } } },
      ),
    ).toBe(true);
  });

  test("is false when a nested value changes", () => {
    expect(
      isPlainObjectDeepEqual(
        { Button: { Icon: { size: "s" } } },
        { Button: { Icon: { size: "m" } } },
      ),
    ).toBe(false);
  });

  test("is false when a key is added or removed", () => {
    expect(
      isPlainObjectDeepEqual(
        { color: "dark" },
        { color: "dark", isDisabled: undefined },
      ),
    ).toBe(false);
    expect(isPlainObjectDeepEqual({ Button: {} }, {})).toBe(false);
  });

  test("compares objects without prototype recursively", () => {
    const withoutPrototype = () =>
      Object.assign(Object.create(null), { id: "button" });
    expect(isPlainObjectDeepEqual(withoutPrototype(), withoutPrototype())).toBe(
      true,
    );
  });

  test("compares primitives by value", () => {
    expect(isPlainObjectDeepEqual("a", "a")).toBe(true);
    expect(isPlainObjectDeepEqual(NaN, NaN)).toBe(true);
    expect(isPlainObjectDeepEqual(1, "1")).toBe(false);
    expect(isPlainObjectDeepEqual(null, {})).toBe(false);
  });

  test("compares functions, arrays, class instances, elements and refs by identity", () => {
    class Model {
      public id = "model";
    }
    const pairs: [unknown, unknown][] = [
      [() => undefined, () => undefined],
      [["a"], ["a"]],
      [new Model(), new Model()],
      [<span key="same" />, <span key="same" />],
      [{ current: null }, { current: null }],
    ];
    for (const [first, second] of pairs) {
      expect(isPlainObjectDeepEqual(first, second)).toBe(false);
      expect(isPlainObjectDeepEqual(first, first)).toBe(true);
    }
  });
});
