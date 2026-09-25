import {
  Fragment,
  withCtx,
  type Component,
  type ComponentInternalInstance,
  type FunctionalComponent,
  type VNode,
} from "vue";
import { normalizeVNodeProps } from "@/lib/propKeys";
import type { AnyRecord } from "@/lib/types";

/**
 * A setup element: it renders nothing and carries what the list reads off it.
 *
 * Functional and typed over an open record, because both halves of that are the
 * authoring surface: JSX needs a call signature on the element type, and the
 * props here are the list's contract (`property`, `mode`, `loader`, …) rather
 * than the component's — the component never sees them.
 */
export type ListSetupComponent = FunctionalComponent<AnyRecord>;

/**
 * A list is configured by the elements inside it, not by one big prop.
 *
 * `<List>` reads its filters, sortings, search and item view off the children
 * it was handed — the same shape Flow's React list has, where `deepFindOfType`
 * scans the children for `ListFilter` and friends. These components therefore
 * render nothing: they exist to be found.
 */
const booleanPropsOf = new WeakMap<Component, readonly string[]>();

/*
 * `booleans` are the props a bare attribute sets to `true` — Vue does that for
 * declared props only, and these declare none.
 */
const setupComponent = (
  name: string,
  booleans: readonly string[] = [],
): ListSetupComponent => {
  const component: ListSetupComponent = () => null;
  component.displayName = name;
  booleanPropsOf.set(component, booleans);
  return component;
};

const loaderFlags = ["manualPagination", "manualFiltering", "manualSorting"];

export const ListStaticData = setupComponent("ListStaticData");
export const ListLoaderAsync = setupComponent("ListLoaderAsync", loaderFlags);
export const ListLoaderComposable = setupComponent(
  "ListLoaderComposable",
  loaderFlags,
);
export const ListItem = setupComponent("ListItem", ["showList", "showTiles"]);
export const ListSearch = setupComponent("ListSearch", [
  "autoSubmit",
  "autosave",
  "autoFocus",
]);
export const ListSorting = setupComponent("ListSorting", [
  "autosave",
  "defaultEnabled",
]);
export const ListFilter = setupComponent("ListFilter", [
  "autosave",
  "manualSave",
]);

/*
 * The table view's shape. Named `ListTable*` rather than `Table*`: this package
 * already exports the standalone Flow table's elements under those names, and
 * two star exports offering one name resolve to nothing — silently.
 */
export const ListTable = setupComponent("ListTable");
export const ListTableHeader = setupComponent("ListTableHeader");
export const ListTableColumn = setupComponent("ListTableColumn");
export const ListTableBody = setupComponent("ListTableBody");
export const ListTableRow = setupComponent("ListTableRow");
export const ListTableCell = setupComponent("ListTableCell");

export interface FoundSetup {
  props: AnyRecord;
  /** The element's scoped default slot, where it has one. */
  render?: (slotProps: AnyRecord) => unknown;
}

const isVNode = (value: unknown): value is VNode =>
  typeof value === "object" && value !== null && "type" in value;

/**
 * Every setup element of one kind, wherever it sits in the children.
 *
 * Walks fragments and arrays, because `v-for` and `<template>` both produce
 * them, but stops at a component: a `ListFilter` inside another component's
 * slot is that component's business, and Flow's React list draws the same
 * line.
 */
export const findSetups = (
  children: unknown,
  component: Component,
): FoundSetup[] => {
  const found: FoundSetup[] = [];

  const walk = (node: unknown): void => {
    if (Array.isArray(node)) {
      node.forEach(walk);
      return;
    }
    if (!isVNode(node)) {
      return;
    }
    if (node.type === component) {
      const slots = node.children as
        | {
            default?: (slotProps: AnyRecord) => unknown;
            _ctx?: ComponentInternalInstance | null;
          }
        | undefined;
      const render = slots?.default;

      found.push({
        props: normalizeVNodeProps(node.props, booleanPropsOf.get(component)),
        /*
         * Bound to whoever wrote the slot. A setup element never mounts, so
         * Vue never wraps its slot the way it does a component's, and the list
         * calling it from its own render would otherwise pass off the
         * extension's item content as the list's own — which is what decides
         * whether a component counts as used (`isRenderedByComposition`).
         */
        render:
          typeof render === "function"
            ? (withCtx(render, slots?._ctx) as typeof render)
            : undefined,
      });
      return;
    }
    if (node.type === Fragment) {
      walk(node.children);
    }
  };

  walk(children);

  return found;
};

export const findSetup = (
  children: unknown,
  component: Component,
): FoundSetup | undefined => findSetups(children, component)[0];
