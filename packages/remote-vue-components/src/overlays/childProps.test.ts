import {
  flattenChildren,
  mapChildren,
  mapSlottedChildren,
} from "@/overlays/childProps";
import { describe, expect, test } from "vitest";
import { createCommentVNode, Fragment, h, type VNode } from "vue";

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
   * `cloneVNode` is what makes this a stand-in for a props context: the child
   * keeps its identity, so a rule cannot silently replace what the author
   * wrote.
   */
  test("leaves the original children untouched", () => {
    const child = h(Marker, { color: "danger" });

    mapChildren([child], () => ({ color: "success" }));

    expect(child.props).toEqual({ color: "danger" });
  });
});

describe("mapSlottedChildren", () => {
  const renderedChildren = (node: VNode): VNode[] => {
    const slots = node.children as { default: () => VNode[] };
    return slots.default();
  };

  test("applies the rule to what the child's slot renders", () => {
    const group = h(Other, { class: "group" }, () => [h(Marker), h(Other)]);

    const mapped = mapSlottedChildren(group, (child) =>
      child.type === Marker ? { color: "danger" } : undefined,
    );

    const children = renderedChildren(mapped);
    expect(children[0]?.props).toMatchObject({ color: "danger" });
    expect(children[1]?.props).toBeNull();
  });

  /*
   * A slot written `() => h(X)` hands back one vnode rather than a list: Vue
   * only normalizes that when the component itself reads its slots, and this
   * calls the function the vnode carries.
   */
  test("takes a slot that renders a single child", () => {
    const group = h(Other, null, () => h(Marker));

    const mapped = mapSlottedChildren(group, () => ({ color: "danger" }));

    expect(renderedChildren(mapped)[0]?.props).toMatchObject({
      color: "danger",
    });
  });

  test("keeps the props the child was given", () => {
    const group = h(Other, { class: "group" }, () => h(Marker));

    expect(mapSlottedChildren(group, () => undefined).props).toMatchObject({
      class: "group",
    });
  });

  test("leaves a child without a default slot alone", () => {
    const child = h(Marker, { color: "danger" });

    expect(mapSlottedChildren(child, () => ({ color: "success" }))).toBe(child);
  });
});
