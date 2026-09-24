import { describe, expect, test, vi } from "vitest";
import { getPropsMerger } from "./getPropsMerger";
import { nestingLevelKey } from "@/lib/propsContext/nestedPropsContext/types";

const merge = getPropsMerger();

describe("plain values", () => {
  test("the later props win", () => {
    expect(merge({ type: "submit" }, { type: "reset" })).toMatchObject({
      type: "reset",
    });
  });

  test("props only one side declares survive", () => {
    expect(merge({ type: "submit" }, { isDisabled: true })).toMatchObject({
      type: "submit",
      isDisabled: true,
    });
  });
});

describe("nesting level", () => {
  /*
   * A nested props context is authored closer to the component it targets, so
   * it outranks the outer one — regardless of which side of the merge it is
   * passed on.
   */
  test("the deeper level wins over argument order", () => {
    expect(
      merge(
        { type: "submit", [nestingLevelKey]: 1 },
        { type: "reset", [nestingLevelKey]: 0 },
      ),
    ).toMatchObject({ type: "submit" });
  });

  test("props without a level count as level 0", () => {
    expect(
      merge({ type: "submit", [nestingLevelKey]: 1 }, { type: "reset" }),
    ).toMatchObject({ type: "submit" });
  });
});

describe("className", () => {
  test("merged by default", () => {
    expect(merge({ className: "outer" }, { className: "inner" })).toMatchObject(
      {
        className: "outer inner",
      },
    );
  });

  test("mergeClassNames: false lets the last className replace the others", () => {
    const merger = getPropsMerger({ mergeClassNames: false });

    expect(
      merger({ className: "outer" }, { className: "inner" }),
    ).toMatchObject({ className: "inner" });
  });

  test("mergeClassNames: false keeps the only className there is", () => {
    const merger = getPropsMerger({ mergeClassNames: false });

    expect(merger({ className: "outer" }, { type: "reset" })).toMatchObject({
      className: "outer",
    });
  });
});

describe("event handlers", () => {
  test("merged by default — both are called", () => {
    const outer = vi.fn();
    const inner = vi.fn();

    const { onPress } = merge({ onPress: outer }, { onPress: inner }) as {
      onPress: () => void;
    };
    onPress();

    expect(outer).toHaveBeenCalledOnce();
    expect(inner).toHaveBeenCalledOnce();
  });

  test("mergeEventHandler: false lets the last handler replace the others", () => {
    const outer = vi.fn();
    const inner = vi.fn();
    const merger = getPropsMerger({ mergeEventHandler: false });

    const { onPress } = merger({ onPress: outer }, { onPress: inner }) as {
      onPress: () => void;
    };
    onPress();

    expect(outer).not.toHaveBeenCalled();
    expect(inner).toHaveBeenCalledOnce();
  });

  test("only on* props count as event handlers", () => {
    const merger = getPropsMerger({ mergeEventHandler: false });

    expect(merger({ once: "outer" }, { type: "reset" })).toMatchObject({
      once: "outer",
    });
  });
});

describe("refs", () => {
  test("every ref is served", () => {
    const outer = vi.fn();
    const inner = { current: null as unknown };

    const { ref } = merge({ ref: outer }, { ref: inner }) as {
      ref: (node: unknown) => void;
    };
    ref("node");

    expect(outer).toHaveBeenCalledWith("node");
    expect(inner.current).toBe("node");
  });

  test("props named *Ref are merged too", () => {
    const outer = vi.fn();
    const inner = vi.fn();

    const { triggerRef } = merge(
      { triggerRef: outer },
      { triggerRef: inner },
    ) as { triggerRef: (node: unknown) => void };
    triggerRef("node");

    expect(outer).toHaveBeenCalledWith("node");
    expect(inner).toHaveBeenCalledWith("node");
  });

  test("a ref nobody supplied stays undefined", () => {
    expect(
      merge({ anchorRef: undefined }, { anchorRef: undefined }),
    ).toMatchObject({ anchorRef: undefined });

    expect(merge({ anchorRef: undefined }, {}).anchorRef).toBeUndefined();
  });

  /*
   * `anchorRef={condition ? ref : undefined}` was enough to hit this: the
   * undefined used to survive into the merge, which then handed back a callback
   * ref. Harmless for a ref the component attaches, fatal for one it reads —
   * nothing ever calls the callback, so `.current` stays empty and the element
   * is never found.
   */
  test("an undefined ref does not turn an object ref into a callback", () => {
    const anchorRef = { current: null as unknown };
    const unset: { anchorRef?: typeof anchorRef } = { anchorRef: undefined };

    expect(merge(unset, { anchorRef }).anchorRef).toBe(anchorRef);
  });

  test("an undefined ref does not swallow the one that is there", () => {
    const supplied = vi.fn();

    const { anchorRef } = merge(
      { anchorRef: undefined },
      { anchorRef: supplied },
    ) as { anchorRef: (node: unknown) => void };
    anchorRef("node");

    expect(supplied).toHaveBeenCalledWith("node");
  });

  test("mergeRefs: false leaves a *Ref prop to the last one that declares it", () => {
    const outer = vi.fn();
    const inner = vi.fn();
    const merger = getPropsMerger({ mergeRefs: false });

    const { triggerRef } = merger(
      { triggerRef: outer },
      { triggerRef: inner },
    ) as { triggerRef: (node: unknown) => void };
    triggerRef("node");

    expect(outer).not.toHaveBeenCalled();
    expect(inner).toHaveBeenCalledWith("node");
  });
});
