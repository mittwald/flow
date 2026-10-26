import { describe, expect, test } from "vitest";
import { arePropsContextsEqual } from "@/lib/propsContext/arePropsContextsEqual";
import { dynamic } from "@/lib/propsContext/dynamicProps/dynamic";

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

  test("compares plain object values recursively", () => {
    expect(
      arePropsContextsEqual(
        { Button: { tunnel: { id: "button", component: "ListItemView" } } },
        { Button: { tunnel: { id: "button", component: "ListItemView" } } },
      ),
    ).toBe(true);
    expect(
      arePropsContextsEqual(
        { Button: { tunnel: { id: "button", component: "ListItemView" } } },
        { Button: { tunnel: { id: "avatar", component: "ListItemView" } } },
      ),
    ).toBe(false);
  });

  test("compares functions, elements and refs by identity", () => {
    expect(
      arePropsContextsEqual(
        { Button: { onPress: () => undefined } },
        { Button: { onPress: () => undefined } },
      ),
    ).toBe(false);
    expect(
      arePropsContextsEqual(
        { Button: { wrapWith: <span /> } },
        { Button: { wrapWith: <span /> } },
      ),
    ).toBe(false);
    expect(
      arePropsContextsEqual(
        { Button: { ref: { current: null } } },
        { Button: { ref: { current: null } } },
      ),
    ).toBe(false);
  });

  test("compares the function of a dynamic prop by identity", () => {
    const getSize = () => "s" as const;
    expect(
      arePropsContextsEqual(
        { Button: { size: dynamic(getSize) } },
        { Button: { size: dynamic(getSize) } },
      ),
    ).toBe(true);
    expect(
      arePropsContextsEqual(
        { Button: { size: dynamic(() => "s") } },
        { Button: { size: dynamic(() => "s") } },
      ),
    ).toBe(false);
  });
});
