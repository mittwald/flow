import { describe, expect, test } from "vitest";
import { arePropsContextsEqual } from "@/lib/propsContext/arePropsContextsEqual";

describe("arePropsContextsEqual", () => {
  const onPress = () => undefined;

  test("is true for structurally equal contexts", () => {
    expect(
      arePropsContextsEqual(
        { Button: { color: "dark", onPress, Icon: { size: "s" } } },
        { Button: { color: "dark", onPress, Icon: { size: "s" } } },
      ),
    ).toBe(true);
  });

  test("is false when a prop value changes", () => {
    expect(
      arePropsContextsEqual(
        { Button: { color: "dark" } },
        { Button: { color: "primary" } },
      ),
    ).toBe(false);
  });

  test("is false when a nested prop value changes", () => {
    expect(
      arePropsContextsEqual(
        { Button: { Icon: { size: "s" } } },
        { Button: { Icon: { size: "m" } } },
      ),
    ).toBe(false);
  });

  test("is false when a prop is added or removed", () => {
    expect(
      arePropsContextsEqual(
        { Button: { color: "dark" } },
        { Button: { color: "dark", isDisabled: undefined } },
      ),
    ).toBe(false);
    expect(arePropsContextsEqual({ Button: {} }, {})).toBe(false);
  });

  test("compares prop values by identity", () => {
    expect(
      arePropsContextsEqual(
        { Button: { onPress: () => undefined } },
        { Button: { onPress: () => undefined } },
      ),
    ).toBe(false);
    expect(
      arePropsContextsEqual(
        { Button: { style: { color: "red" } } },
        { Button: { style: { color: "red" } } },
      ),
    ).toBe(false);
  });
});
