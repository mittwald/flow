import { ListDateRangeFilter } from "@mittwald/flow-components-base";
import type {
  ListDateTimeRangeLimits,
  ListModelContext,
} from "@mittwald/flow-components-base";
import type { ListRendered, VueListFilterShape } from "./types";

/**
 * A date-range filter, with the options its fields take.
 *
 * The column, the comparison and the stored value are the shared
 * `ListDateRangeFilter`, so a Vue list and a React list filter the same dates
 * the same way. What a binding adds is only what its fields accept.
 */
export class DateRangeFilter<T = never> extends ListDateRangeFilter<
  T,
  never,
  ListRendered
> {
  /** Handed to the `RangeCalendar` — a minimum date, unavailable days, … */
  public readonly dateRangeOptions?: Record<string, unknown>;

  public constructor(
    context: ListModelContext<T>,
    shape: VueListFilterShape<T>,
  ) {
    super(context, shape as never);
    this.dateRangeOptions = (
      shape as { dateRangeOptions?: Record<string, unknown> }
    ).dateRangeOptions;
  }

  public get granularity(): "day" | "minute" {
    return this.dateRangeOptions?.granularity === "minute" ? "minute" : "day";
  }

  public get rangeCalendarProps(): Record<string, unknown> {
    if (this.granularity === "minute") {
      return {};
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { granularity, ...props } = this.dateRangeOptions ?? {};
    return props;
  }

  public get dateTimeRangeLimits(): ListDateTimeRangeLimits | undefined {
    return this.granularity === "minute"
      ? (this.dateRangeOptions as ListDateTimeRangeLimits)
      : undefined;
  }
}

/** Whether a filter is one of these, without reaching for the class. */
export const isDateRangeFilter = (filter: {
  readonly mode: string;
}): filter is DateRangeFilter<never> => filter.mode === "dateRange";
