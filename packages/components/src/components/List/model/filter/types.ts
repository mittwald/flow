import type {
  PropertyName,
  PropertyValue,
  PropertyValueRenderMethod,
} from "@/components/List/model/types";
import type { ItemType } from "@/lib/types/array";
import type { RangeCalendarProps } from "@/components/Calendar";

export type FilterMode = "all" | "some" | "one" | "dateRange";

export type FilterMatcher<T, P, TMatcherValue> = (
  filterBy: NonNullable<ItemType<TMatcherValue>>,
  filterFrom: PropertyValue<T, P>,
) => boolean;

export interface FilterShape<T, TProp extends PropertyName<T>, TMatcherValue> {
  property: TProp;
  renderItem?: PropertyValueRenderMethod<TMatcherValue>;
  mode?: FilterMode;
  matcher?: FilterMatcher<T, TProp, TMatcherValue>;
  values?: readonly TMatcherValue[];
  name?: string;
  defaultSelected?: readonly NonNullable<TMatcherValue>[];
  priority?: "primary" | "secondary";
  dateRangeOptions?: RangeCalendarProps;
}
