import { defineComponent, Fragment, type Component, type VNode } from "vue";
import type { AnyRecord } from "@/lib/types";

/**
 * A list is configured by the elements inside it, not by one big prop.
 *
 * `<List>` reads its filters, sortings, search and item view off the children
 * it was handed — the same shape Flow's React list has, where `deepFindOfType`
 * scans the children for `ListFilter` and friends. These components therefore
 * render nothing: they exist to be found.
 */
const setupComponent = (name: string): Component =>
  defineComponent({
    name,
    setup: () => () => null,
  });

export const ListStaticData = setupComponent("ListStaticData");
export const ListLoaderAsync = setupComponent("ListLoaderAsync");
export const ListItem = setupComponent("ListItem");
export const ListSearch = setupComponent("ListSearch");
export const ListSorting = setupComponent("ListSorting");
export const ListFilter = setupComponent("ListFilter");

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
        { default?: (slotProps: AnyRecord) => unknown } | undefined;

      found.push({
        props: (node.props ?? {}) as AnyRecord,
        render:
          typeof slots?.default === "function" ? slots.default : undefined,
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
