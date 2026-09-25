import { getContext, setContext } from "svelte";
import type { Component } from "svelte";
import type { FlowIconName } from "../icons/iconNames.js";

/**
 * A replacement icon is rendered as `Icon`'s child with **no props** — the
 * wrapper keeps `size`, `color` and the rest for `Icon` itself. So a component
 * in a set must not require any.
 */
export type FlowIconComponent = Component<Record<string, never>>;

/**
 * Icons by name, the way `defaultIconSet` is shaped in React. Partial, because
 * a set that replaces a handful of icons is the common case — anything it does
 * not name keeps Flow's own.
 */
export type IconSet = Partial<Record<FlowIconName, FlowIconComponent>>;

const iconSetKey = Symbol.for("flow.remote.svelte.iconSet");

export const setIconSet = (set: IconSet): void => {
  setContext(iconSetKey, set);
};

/**
 * The replacement for an icon, if a surrounding `IconSetProvider` named one.
 *
 * Read while the icon initializes, like every Svelte context — which is also
 * why a set cannot be swapped at runtime. React's cannot either: the icons read
 * it through `useContextIcon` and a new set re-renders them, but the shape is
 * the same.
 */
export const useContextIcon = (
  icon: FlowIconName,
): FlowIconComponent | undefined =>
  getContext<IconSet | undefined>(iconSetKey)?.[icon];
