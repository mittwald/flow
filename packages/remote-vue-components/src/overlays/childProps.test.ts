import {
  dynamic,
  flattenChildren,
  mapChildren,
  withSlotContent,
} from "@/overlays/childProps";
import { describe, expect, test } from "vitest";
import { createCommentVNode, Fragment, h, Text, type VNode } from "vue";

const Marker = { name: "Marker", render: () => null };
const Other = { name: "Other", render: () => null };

describe("flattenChildren", () => {
  test("sees through the fragments a list produces", () => {
    const children = [h(Fragment, [h(Marker), h(Other)]), h(Marker)];

    expect(flattenChildren(children).map((child) => child.type)).toEqual([
      Marker,
      Other,
      Marker,
    ]);
  });

  /*
   * A `v-if` that does not match leaves a comment behind. Counting it as a
   * child makes a composite treat an absent overlay as present.
   */
  test("drops the placeholder an unmatched v-if leaves", () => {
    const children = [createCommentVNode("v-if"), h(Marker)];

    expect(flattenChildren(children)).toHaveLength(1);
  });

  /* What a render function may hand back before Vue normalizes it. */
  test("drops null and booleans, keeps text, and flattens nested lists", () => {
    const children = [null, false, [h(Marker), [undefined, h(Other)]], "text"];

    expect(
      flattenChildren(children).map((child) =>
        typeof child.type === "symbol" ? child.children : child.type,
      ),
    ).toEqual([Marker, Other, "text"]);
  });

  test("survives no children at all", () => {
    expect(flattenChildren(undefined)).toEqual([]);
  });
});

describe("mapChildren", () => {
  test("merges props into the children a rule matches", () => {
    const children: VNode[] = [h(Marker, { color: "danger" }), h(Other)];

    const mapped = mapChildren(children, (child) =>
      child.type === Marker ? { class: "added", size: "l" } : undefined,
    );

    expect(mapped[0]?.props).toMatchObject({
      color: "danger",
      class: "added",
      size: "l",
    });
    expect(mapped[1]?.props).toBeNull();
  });

  /*
   * The merge rules of Flow's props context: the author's value wins, in
   * either spelling, and only a `dynamic` rule overrides it.
   */
  test("keeps the child's own value over the rule's", () => {
    const children: VNode[] = [
      h(Marker, { color: "danger", "is-disabled": "" }),
    ];

    const [mapped] = mapChildren(children, () => ({
      color: "success",
      isDisabled: false,
      size: "l",
    }));

    expect(mapped?.props).toEqual({
      color: "danger",
      "is-disabled": "",
      size: "l",
    });
  });

  test("lets a dynamic rule override the child's value", () => {
    const [mapped] = mapChildren([h(Marker, { "close-modal": true })], () => ({
      closeModal: dynamic({ bypassConfirmation: true }),
    }));

    expect(mapped?.props).toEqual({
      closeModal: { bypassConfirmation: true },
    });
  });

  test("joins the classes, the rule's first", () => {
    const [mapped] = mapChildren([h(Marker, { class: "own" })], () => ({
      class: "added",
    }));

    expect(mapped?.props?.class).toBe("added own");
  });

  test("chains handlers: the rule's, the child's, then dynamic ones", () => {
    const calls: string[] = [];
    const children = [h(Marker, { onPress: () => calls.push("child") })];

    const [mapped] = mapChildren(children, () => ({
      onPress: () => calls.push("rule"),
      onPressEnd: dynamic(() => calls.push("dynamic")),
    }));
    const [again] = mapChildren(mapped ? [mapped] : [], () => ({
      onPress: dynamic(() => calls.push("dynamic")),
    }));

    for (const handler of [again?.props?.onPress].flat(2)) {
      (handler as () => void)();
    }

    expect(calls).toEqual(["rule", "child", "dynamic"]);
  });

  /*
   * A props context never changes what the author wrote: the child's vnode
   * stays as it was, and the mapped one is a copy.
   */
  test("leaves the original children untouched", () => {
    const child = h(Marker, { color: "danger" });

    mapChildren([child], () => ({ color: "success" }));

    expect(child.props).toEqual({ color: "danger" });
  });
});

describe("withSlotContent", () => {
  /* What the rebuilt node renders, with `build` handing the content back. */
  const content = (node: VNode): VNode[] => {
    const rebuilt = withSlotContent(node, (rendered) => rendered);
    return (rebuilt.children as { default: () => VNode[] }).default();
  };

  const describeChild = (child: VNode) =>
    child.type === Text ? child.children : child.type;

  test("reads a slot function", () => {
    expect(
      content(h(Other, null, () => [h(Marker), "text"])).map(describeChild),
    ).toEqual([Marker, "text"]);
  });

  /*
   * A slot written `() => h(X)` hands back one vnode rather than a list: Vue
   * only normalizes that when the component itself reads its slots.
   */
  test("takes a slot that renders a single child", () => {
    expect(content(h(Other, null, () => h(Marker))).map(describeChild)).toEqual(
      [Marker],
    );
  });

  /* What `vue/jsx-runtime` and `h()` with non-function children produce. */
  test("reads children handed as a string", () => {
    expect(content(h(Other, null, "Crew roster")).map(describeChild)).toEqual([
      "Crew roster",
    ]);
  });

  test("reads children handed as an array", () => {
    expect(
      content(h(Other, null, [h(Marker), h(Fragment, [h(Other)])])).map(
        describeChild,
      ),
    ).toEqual([Marker, Other]);
  });

  test("reads a slot object whose default is a value", () => {
    expect(
      content(h(Other, null, { default: [h(Marker)] } as never)).map(
        describeChild,
      ),
    ).toEqual([Marker]);
  });

  test("keeps the props the child was given", () => {
    const group = h(Other, { class: "group" }, () => h(Marker));

    expect(withSlotContent(group, (rendered) => rendered).props).toMatchObject({
      class: "group",
    });
  });

  test("renders nothing for a child without children", () => {
    expect(content(h(Marker))).toEqual([]);
  });
});
