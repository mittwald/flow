import { flattenChildren, mapChildren } from "@/overlays/childProps";
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
