import type { ItemType } from "@/lib/types/array";
import type {
  PropertyName,
  PropertyValue,
} from "@/components/List/model/types";

export type FilterMode = "all" | "some" | "one";

export type FilterValue<T, P> = ItemType<NonNullable<PropertyValue<T, P>>>;

export type FilterMatcher<T, P, TMatcherValue> = (
  filterBy: FilterValue<T, P>,
  filterFrom: TMatcherValue[],
) => boolean;

export interface FilterShape<T, TProp extends PropertyName<T>, TMatcherValue> {
  property: TProp;
  mode?: FilterMode;
  matcher?: FilterMatcher<T, TProp, TMatcherValue>;
  values?: TMatcherValue[];
  name?: string;
}
