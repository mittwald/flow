import type { PropertyName } from "../types";
import type {
  SortDirection,
  SortingFn as TableSortingFn,
} from "@tanstack/table-core";

/** `"hidden"` keeps a sorting out of the UI but leaves it usable in code. */
export type SortingDefaultMode = boolean | "hidden";

export type SortingFn<T> = TableSortingFn<T>;

export interface ListSortingShape<T> {
  property: PropertyName<T>;
  name?: string;
  directionName?: string;
  direction?: SortDirection;
  defaultEnabled?: SortingDefaultMode;
  customSortingFn?: SortingFn<T>;
  autosave?: boolean;
}
