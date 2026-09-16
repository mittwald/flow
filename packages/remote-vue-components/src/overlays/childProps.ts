import { cloneVNode, Comment, Fragment, Text, type VNode } from "vue";
import type { AnyRecord } from "@/lib/types";

/**
 * Vue's stand-in for Flow's `PropsContext`.
 *
 * Flow configures the components inside a composite — the `Heading` of a
 * `Modal`, the `Button` of an `Action` — through a React context every
 * `flowComponent` reads. There is no such context on the Vue side, so the
 * composite reaches its children directly: `cloneVNode` merges props the same
 * way, including class lists and event handlers.
 *
 * The difference that matters: this only reaches the children the composite was
 * handed, not arbitrary descendants. A `Heading` nested one component deeper
 * than the composite expects is left alone.
 */
export const mapChildren = (
  children: VNode[] | undefined,
  decide: (child: VNode) => AnyRecord | undefined,
): VNode[] =>
  flattenChildren(children).map((child) => {
    const props = decide(child);
    return props ? cloneVNode(child, props) : child;
  });

/**
 * Slots hand back fragments wherever the author wrote a list or a `v-for`, and
 * comments wherever a `v-if` did not match. Both have to be seen through, or a
 * composite's rules miss every child inside them.
 */
export const flattenChildren = (children: VNode[] | undefined): VNode[] => {
  const result: VNode[] = [];

  for (const child of children ?? []) {
    if (child.type === Comment) {
      continue;
    }
    if (child.type === Fragment && Array.isArray(child.children)) {
      result.push(...flattenChildren(child.children as VNode[]));
      continue;
    }
    result.push(child);
  }

  return result;
};

/** Whether a node renders text rather than a component. */
export const isTextChild = (child: VNode): boolean => child.type === Text;
