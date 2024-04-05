import type { PropertyName } from "@/components/List/model/item/Item";

export interface SortingShape<T> {
  property: PropertyName<T>;
  name?: string;
}
