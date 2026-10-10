import type {
  PropertyName,
  PropertyValue,
  PropertyValueRenderMethod,
} from "@/components/List/model/types";
import type { ItemType } from "@/lib/types/array";
import type { RangeCalendarProps } from "@/components/Calendar";
import type { DateRangeFilter } from "@/components/List/model/filter/DateRangeFilter";
import type { DateValue } from "@internationalized/date";

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
  dateRangeOptions?: DateRangeFilterOptions;
}

export type DateRangeFilterOptions =
  | ({
      /**
       * Whether the filter narrows down by date only, or by date and time.
       *
       * @default "day"
       */
      granularity?: "day";
    } & RangeCalendarProps)
  | {
      granularity: "minute";
      minValue?: DateValue | null;
      maxValue?: DateValue | null;
      isDateUnavailable?: (date: DateValue) => boolean;
    };

/**
 * A date covers its whole day, a date with time its whole minute. A missing
 * side has no bound.
 */
export interface DateRangeFilterValue {
  start?: DateValue;
  end?: DateValue;
}

export type FilterUpdatedCallback = (values: unknown[]) => unknown;

export type AnyDateRangeFilter =
  | DateRangeFilter
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  | DateRangeFilter<any, any>;
