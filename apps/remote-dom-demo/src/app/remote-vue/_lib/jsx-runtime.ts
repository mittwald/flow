import { cloneVNode, h, isVNode, type VNode } from "vue";
import type { NativeElements, ReservedProps } from "vue";

/**
 * The JSX runtime the Vue demos compile against.
 *
 * `/** @jsxImportSource @/app/remote-vue/_lib *\/` at the top of a file points
 * TypeScript and Next's compiler here, which is what lets the Vue demos be
 * written the way the React pages next to them are.
 *
 * Vue ships `vue/jsx-runtime`, and it works — but it hands a component its
 * children as a value rather than as a slot function, and Vue then warns
 * "Non-function value encountered for default slot" for every single element.
 * That is one warning per component in a demo app whose console is the thing
 * developers read. Wrapping the children is the whole difference.
 */

type Props = Record<string, unknown> & { children?: unknown };

const isSlotsObject = (
  children: unknown,
): children is Record<string, unknown> =>
  typeof children === "object" &&
  children !== null &&
  !Array.isArray(children) &&
  !isVNode(children);

/*
 * A copy of the children for every call of the slot.
 *
 * JSX builds the children once, when the parent renders, but a component calls
 * its slot again on every render of its own. Vue mounts a vnode in place — it
 * writes `el` onto it and normalizes an element's children array into itself —
 * so the second call would hand it nodes that already belong to the first
 * render. The copy goes as deep as the arrays go: a component's own children
 * are a slot again, and copied when that slot is called.
 */
const freshCopy = (children: unknown): unknown => {
  if (Array.isArray(children)) {
    return children.map(freshCopy);
  }
  if (!isVNode(children)) {
    return children;
  }
  const copy = cloneVNode(children);
  if (Array.isArray(copy.children)) {
    copy.children = copy.children.map(freshCopy) as VNode[];
  }
  return copy;
};

export const jsx = (
  type: Parameters<typeof h>[0],
  props: Props | null,
  key?: string | number,
): VNode => {
  const { children, ...rest } = props ?? {};
  const attributes = key === undefined ? rest : { ...rest, key };

  if (children === undefined) {
    return h(type, attributes);
  }

  /* An intrinsic element takes its children as they are — it has no slots. */
  if (typeof type === "string") {
    return h(type, attributes, children as never);
  }

  /*
   * `<Comp>{{ default: () => …, footer: () => … }}</Comp>` is how Vue JSX
   * writes named and scoped slots, and that object is handed through
   * untouched. Anything else is the default slot, wrapped so Vue gets the
   * function it asks for.
   */
  if (isSlotsObject(children)) {
    return h(type, attributes, children);
  }

  return h(type, attributes, { default: () => freshCopy(children) });
};

export const jsxs = jsx;
export const jsxDEV = jsx;
export { Fragment } from "vue";

export namespace JSX {
  export interface Element extends VNode {}
  export interface ElementClass {
    $props: object;
  }
  export interface ElementAttributesProperty {
    $props: object;
  }
  export interface IntrinsicElements extends NativeElements {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [name: string]: any;
  }
  /**
   * `children` on every element, because Vue's own JSX namespace has no
   * `ElementChildrenAttribute` and none of Flow's components declare a
   * `children` prop — they take slots. Without this, every element with content
   * is a type error.
   */
  export interface IntrinsicAttributes extends ReservedProps {
    children?: unknown;
  }
}
