import type { PropertyName } from "@/components/List/model/types";
import type {
  SortDirection,
  SortingFn as SortingFunction,
} from "@tanstack/react-table";

export type SortingDefaultMode = boolean | "hidden";

export type SortingFn<T> = SortingFunction<T>;

export interface SortingShape<T> {
  property: PropertyName<T>;
  name?: string;
  directionName?: string;
  direction?: SortDirection;
  defaultEnabled?: SortingDefaultMode;
  customSortingFn?: SortingFn<T>;
}
