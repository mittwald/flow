import {
  cloneVNode,
  Comment,
  Fragment,
  h,
  Text,
  type Component,
  type VNode,
} from "vue";
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

/**
 * Applies the same rules one level deeper: to the children a child was handed.
 *
 * Flow's props context reaches a whole subtree, so a rule it writes for
 * `ActionGroup > Action` finds the actions inside the group. `mapChildren`
 * reaches one level, so a composite that has to configure a grandchild — the
 * `Modal` telling the actions in its footer not to ask for confirmation — asks
 * for that second level explicitly.
 *
 * Rebuilt rather than cloned: `cloneVNode` merges props and leaves children
 * alone, and the children of a component are its slot functions.
 *
 * The slot is called raw, the way the vnode carries it — Vue only normalizes a
 * slot's result when the component itself reads it, so a slot written `() =>
 * h(Action, …)` hands back one vnode and not a list.
 */
export const mapSlottedChildren = (
  node: VNode,
  decide: (child: VNode) => AnyRecord | undefined,
): VNode => {
  const slots = node.children;

  if (!slots || typeof slots !== "object" || Array.isArray(slots)) {
    return node;
  }

  const defaultSlot = (slots as Record<string, unknown>).default;

  if (typeof defaultSlot !== "function") {
    return node;
  }

  return h(node.type as Component, node.props ?? undefined, {
    ...(slots as Record<string, unknown>),
    default: (...args: unknown[]) => {
      const rendered = (
        defaultSlot as (...slotArgs: unknown[]) => VNode | VNode[]
      )(...args);
      return mapChildren(
        Array.isArray(rendered) ? rendered : [rendered],
        decide,
      );
    },
  });
};
