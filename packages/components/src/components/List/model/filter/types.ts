import type {
  PropertyName,
  PropertyValue,
} from "@/components/List/model/types";
import type { ItemType } from "@/lib/types/array";

export type FilterMode = "all" | "some" | "one";

export type FilterMatcher<T, P, TMatcherValue> = (
  filterBy: NonNullable<ItemType<TMatcherValue>>,
  filterFrom: PropertyValue<T, P>,
) => boolean;

export interface FilterShape<T, TProp extends PropertyName<T>, TMatcherValue> {
  property: TProp;
  mode?: FilterMode;
  matcher?: FilterMatcher<T, TProp, TMatcherValue>;
  values?: TMatcherValue[];
  name?: string;
}
