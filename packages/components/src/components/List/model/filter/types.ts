import type {
  PropertyName,
  PropertyValue,
  PropertyValueRenderMethod,
} from "@/components/List/model/types";
import type { ItemType } from "@/lib/types/array";
import type { RangeCalendarProps } from "@/components/Calendar";
import type { DateRangeFilter } from "@/components/List/model/filter/DateRangeFilter";

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
  onChange?: FilterUpdatedCallback;
  priority?: "primary" | "secondary";
  autosave?: boolean;
  manualSave?: boolean;
  dateRangeOptions?: RangeCalendarProps;
}

export type FilterUpdatedCallback = (values: unknown[]) => unknown;

export type AnyDateRangeFilter =
  | DateRangeFilter
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  | DateRangeFilter<any, any>;
