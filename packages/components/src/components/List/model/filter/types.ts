import { PropertyName } from "@/components/List/model/item/Item";

export type FilterMode = "all" | "some" | "one";

export type FilterMatcher = (
  filterValue: unknown,
  property: unknown,
) => boolean;

export interface FilterShape<T> {
  property: PropertyName<T>;
  mode?: FilterMode;
  matcher?: FilterMatcher;
  values?: unknown[];
}
