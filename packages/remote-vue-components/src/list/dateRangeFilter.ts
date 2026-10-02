import { ListDateRangeFilter } from "@mittwald/flow-components-base";
import type {
  ListDateParts,
  ListDateRange,
  ListModelContext,
} from "@mittwald/flow-components-base";
import type { ListRendered, VueListFilterShape } from "./types";

/**
 * A date-range filter, with the options its calendar takes.
 *
 * The column, the comparison and the stored value are the shared
 * `ListDateRangeFilter`, so a Vue list and a React list filter the same dates
 * the same way. What a binding adds is only what its calendar accepts.
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
}

/** Whether a filter is one of these, without reaching for the class. */
export const isDateRangeFilter = (filter: {
  readonly mode: string;
}): filter is DateRangeFilter<never> => filter.mode === "dateRange";

/** `01/03/2024`, the way `Intl` writes it for the host's locale. */
export const formatDate = (date: ListDateParts): string =>
  new Date(date.year, date.month - 1, date.day).toLocaleDateString();

export const formatDateRange = (range: ListDateRange): string =>
  [range.start, range.end]
    .map((date) => (date ? formatDate(date) : ""))
    .join(" - ");
