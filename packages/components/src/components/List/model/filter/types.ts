import type { DateRangeFilter } from "@/components/List/model/filter/DateRangeFilter";
import type { PropertyName } from "@/components/List/model/types";
import type { RangeCalendarProps } from "@/components/Calendar";
import type { ListFilterShape } from "@mittwald/flow-components-base";
import type { ReactNode } from "react";
import type { DateValue } from "@internationalized/date";

export type {
  FilterMatcher,
  FilterMode,
  FilterUpdatedCallback,
} from "@mittwald/flow-components-base";

export interface FilterShape<
  T,
  TProp extends PropertyName<T>,
  TMatcherValue,
> extends ListFilterShape<T, TProp, TMatcherValue, ReactNode> {
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

export type AnyDateRangeFilter =
  | DateRangeFilter
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  | DateRangeFilter<any, any>;
