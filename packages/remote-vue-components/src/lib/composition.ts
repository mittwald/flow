import { getCurrentInstance, type ComponentInternalInstance } from "vue";

const compositions = new WeakSet<object>();

/**
 * Marks one of this package's own components — a composition such as `Modal` or
 * `List`, or the root. The elements it creates are its implementation, not the
 * extension's.
 */
export const composition = <T extends object>(component: T): T => {
  compositions.add(component);
  return component;
};

/**
 * Whether the calling component was created by a composition rather than by the
 * extension.
 *
 * Vue records on every vnode the instance whose render created it (`ctx`),
 * `cloneVNode` keeps it, and a slot runs with the context of whoever wrote it.
 * An extension's `<Heading>` inside a `<Modal>` therefore belongs to the
 * extension, and the `OverlayContent` the `Modal` renders around it belongs to
 * the `Modal` — the line Flow's React views draw with `markViewComponents`.
 */
export const isRenderedByComposition = (): boolean => {
  const vnode = getCurrentInstance()?.vnode as
    { ctx?: ComponentInternalInstance | null } | undefined;
  const owner = vnode?.ctx;
  return !!owner && compositions.has(owner.type);
};
