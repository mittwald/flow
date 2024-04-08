import type { PropertyName } from "@/components/List/model/item/Item";
import type { SortDirection } from "@tanstack/react-table";

export interface SortingShape<T> {
  property: PropertyName<T>;
  name?: string;
  direction?: SortDirection;
  defaultEnabled?: boolean;
}
