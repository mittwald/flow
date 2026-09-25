import {
  cloneVNode,
  Comment,
  createTextVNode,
  Fragment,
  getCurrentInstance,
  h,
  isVNode,
  normalizeClass,
  Text,
  withCtx,
  type Component,
  type ComponentInternalInstance,
  type VNode,
} from "vue";
import { flattenHandlers, isHandlerKey } from "@/lib/handlers";
import { hyphenate } from "@/lib/propKeys";
import type { AnyRecord } from "@/lib/types";

class DynamicProp {
  public constructor(public readonly value: unknown) {}
}

/**
 * A prop that wins over the child's own, and a handler that runs after the
 * child's — what `dynamic()` does in Flow's props context. The value is usually
 * derived from the child's props (`Modal`'s `closeModal` rule).
 */
export const dynamic = (value: unknown): DynamicProp => new DynamicProp(value);

/**
 * Merges props into a child the way Flow's props context merges them: the
 * child's own value wins unless the rule is `dynamic`, classes are joined, and
 * handlers are chained — the context's, the child's, then the dynamic ones.
 *
 * `cloneVNode` alone merges the other way round (the added props win), so the
 * props are rebuilt here. A template may write a key kebab-case; both spellings
 * count as the child's own.
 */
export const withContextProps = (
  child: VNode,
  contextProps: AnyRecord,
): VNode => {
  const merged: AnyRecord = { ...child.props };

  for (const [key, rule] of Object.entries(contextProps)) {
    const isDynamic = rule instanceof DynamicProp;
    const value: unknown = isDynamic ? rule.value : rule;

    if (key === "class") {
      merged.class = normalizeClass([value, merged.class]);
      continue;
    }

    if (isHandlerKey(key)) {
      const context = flattenHandlers(value);
      const own = flattenHandlers(merged[key]);
      const handlers = isDynamic ? [...own, ...context] : [...context, ...own];
      merged[key] = handlers.length > 1 ? handlers : handlers[0];
      continue;
    }

    const kebabKey = hyphenate(key);
    if (isDynamic) {
      delete merged[kebabKey];
      merged[key] = value;
    } else if (merged[key] === undefined && merged[kebabKey] === undefined) {
      merged[key] = value;
    }
  }

  const clone = cloneVNode(child, {});
  clone.props = merged;
  return clone;
};

/**
 * Vue's stand-in for Flow's `PropsContext`.
 *
 * Flow configures the components inside a composite — the `Heading` of a
 * `Modal`, the `Button` of an `Action` — through a React context every
 * `flowComponent` reads. There is no such context on the Vue side, so the
 * composite reaches its children directly, merging the way the context does
 * (`withContextProps`).
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
    return props ? withContextProps(child, props) : child;
  });

/**
 * Slots hand back fragments wherever the author wrote a list or a `v-for`, and
 * comments wherever a `v-if` did not match. Both have to be seen through, or a
 * composite's rules miss every child inside them. A render function may also
 * hand back `null`, a boolean, a nested array or a bare string, which Vue
 * normalizes only later.
 */
export const flattenChildren = (children: unknown): VNode[] => {
  const result: VNode[] = [];

  const walk = (child: unknown): void => {
    if (Array.isArray(child)) {
      child.forEach(walk);
    } else if (typeof child === "string" || typeof child === "number") {
      result.push(createTextVNode(String(child)));
    } else if (!isVNode(child) || child.type === Comment) {
      return;
    } else if (child.type === Fragment && Array.isArray(child.children)) {
      walk(child.children);
    } else {
      result.push(child);
    }
  };

  walk(children);

  return result;
};

/** Whether a node renders text rather than a component. */
export const isTextChild = (child: VNode): boolean => child.type === Text;

type Owner = ComponentInternalInstance | null | undefined;

/*
 * Who wrote a node, and who wrote its slots. Vue keeps both on the node (`ctx`,
 * and `_ctx` on the slots object) and decides from them which instance a slot
 * renders under — and this package decides from it whether a component counts
 * as the extension's (`isRenderedByComposition`).
 */
const ownerOf = (node: VNode): Owner => (node as { ctx?: Owner }).ctx;

const slotOwnerOf = (node: VNode, slots: object): Owner =>
  (slots as { _ctx?: Owner })._ctx ?? ownerOf(node);

/**
 * `h(node.type, …)` with new slots, owned by whoever wrote `node`.
 *
 * `h` alone would hand the node and every slot to the composite rendering it:
 * the extension's `Heading` inside a `Modal` would count as the `Modal`'s own.
 * Each slot runs as its author's again, and the node keeps its author.
 */
const rebuildWithSlots = (
  node: VNode,
  slots: Record<string, unknown>,
): VNode => {
  const owner = slotOwnerOf(node, slots);
  const ownedSlots = Object.fromEntries(
    Object.entries(slots)
      .filter(([key]) => !key.startsWith("_"))
      .map(([key, slot]) => [
        key,
        typeof slot === "function"
          ? withCtx(slot as (...args: unknown[]) => unknown, owner)
          : slot,
      ]),
  );
  const rebuilt = h(
    node.type as Component,
    node.props ?? undefined,
    ownedSlots,
  );
  (rebuilt as { ctx?: Owner }).ctx = ownerOf(node);
  return rebuilt;
};

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

  return rebuildWithSlots(node, {
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

/**
 * Rebuilds a child around new default-slot content.
 *
 * `mapSlottedChildren` maps the props of what a child was handed; this replaces
 * that content outright — which is what a composite needs when it does not
 * configure a child but _wraps_ it. Flow's `Modal` does exactly that to its
 * heading: the title goes into a container and the close button is appended
 * beside it.
 */
export const withSlotContent = (
  node: VNode,
  build: (rendered: VNode[]) => VNode[],
): VNode => {
  const slots = node.children;
  const defaultSlot =
    slots && typeof slots === "object" && !Array.isArray(slots)
      ? (slots as Record<string, unknown>).default
      : undefined;

  const rendered = (...args: unknown[]): VNode[] => {
    if (typeof defaultSlot !== "function") {
      return [];
    }
    const result = (defaultSlot as (...slotArgs: unknown[]) => VNode | VNode[])(
      ...args,
    );
    return Array.isArray(result) ? result : [result];
  };

  /*
   * The content is the author's, the wrapping around it the composite's: what
   * `build` adds — a container, a close button — runs as the composite that
   * asked for it.
   */
  const composite = getCurrentInstance();
  const buildAsComposite = withCtx(
    (content: VNode[]) => build(content),
    composite,
  ) as (content: VNode[]) => VNode[];

  return rebuildWithSlots(node, {
    ...(typeof slots === "object" && slots && !Array.isArray(slots)
      ? (slots as Record<string, unknown>)
      : {}),
    default: (...args: unknown[]) => buildAsComposite(rendered(...args)),
  });
};

/**
 * What a composite writes for one kind of child: the props it merges in, and
 * the rules for what that child renders — Flow's nested props context entries
 * (`Content: { Heading: { level: 3 } }`).
 */
export interface ChildRule {
  props?: AnyRecord;
  children?: ChildRules;
}

export type ChildRules = (child: VNode) => ChildRule | undefined;

/**
 * Applies nested rules, each level to the children of the one above — as far
 * down as the rules go, where `mapChildren` reaches one level.
 */
export const applyChildRules = (
  children: VNode[] | undefined,
  rules: ChildRules,
): VNode[] =>
  flattenChildren(children).map((child) => {
    const rule = rules(child);
    if (!rule) {
      return child;
    }

    const configured = rule.props ? withContextProps(child, rule.props) : child;
    const nested = rule.children;

    return nested
      ? withSlotContent(configured, (rendered) =>
          applyChildRules(rendered, nested),
        )
      : configured;
  });
