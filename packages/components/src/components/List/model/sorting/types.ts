import type { PropertyName } from "@/components/List/model/types";
import type { SortDirection, SortingFn } from "@tanstack/react-table";

export type SortingDefaultMode = boolean | "hidden";

export interface SortingShape<T> {
  property: PropertyName<T>;
  name?: string;
  direction?: SortDirection;
  defaultEnabled?: SortingDefaultMode;
  customSortingFn?: SortingFn<T>;
}
