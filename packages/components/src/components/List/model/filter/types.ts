import type { DateRangeFilter } from "@/components/List/model/filter/DateRangeFilter";
import type { PropertyName } from "@/components/List/model/types";
import type { RangeCalendarProps } from "@/components/Calendar";
import type { ListFilterShape } from "@mittwald/flow-components-base";
import type { ReactNode } from "react";

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
  dateRangeOptions?: RangeCalendarProps;
}

export type AnyDateRangeFilter =
  | DateRangeFilter
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  | DateRangeFilter<any, any>;
