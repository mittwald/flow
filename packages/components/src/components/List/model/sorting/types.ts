import type { SortDirection } from "@tanstack/react-table";
import type { PropertyName } from "~/components/List/model/types";

export type SortingDefaultMode = boolean | "hidden";

export interface SortingShape<T> {
  property: PropertyName<T>;
  name?: string;
  direction?: SortDirection;
  defaultEnabled?: SortingDefaultMode;
}
