import { ListDateRangeFilter } from "@mittwald/flow-components-base";
import type { ListModelContext } from "@mittwald/flow-components-base";
import type { FilterShape } from "@/components/List/model/filter/types";
import type { PropertyName } from "@/components/List/model/types";
import type { RangeCalendarProps } from "@/components/Calendar";
import type { DateValue } from "@internationalized/date";
import type { DateRange, RangeValue } from "react-aria-components";
import type { ReactNode } from "react";
import type { List } from "@/components/List/model/List";

/**
 * React's date-range filter.
 *
 * The column, the comparison and the stored value are `ListDateRangeFilter` in
 * `@mittwald/flow-components-base`, so the Vue binding filters the same dates
 * the same way. What is left here is the calendar's own options, which are
 * Flow's `RangeCalendar` props.
 */
export class DateRangeFilter<
  T = never,
  TProp extends PropertyName<T> = never,
> extends ListDateRangeFilter<T, TProp, ReactNode> {
  public readonly dateRangeOptions?: RangeCalendarProps;

  public constructor(
    context: ListModelContext<T>,
    shape: FilterShape<T, TProp, never>,
  ) {
    super(context, shape as never);
    this.dateRangeOptions = shape.dateRangeOptions;
  }

  /*
   * Narrowed back to react-aria's own types, because that is what the calendar
   * takes and what this filter's consumers already have. The shared class is
   * typed on the three numbers a date is made of, which every date library
   * agrees on and nothing else does.
   */
  public override getValue(): DateRange | null {
    return super.getValue() as DateRange | null;
  }

  public override setValue(range: RangeValue<DateValue> | null): void {
    super.setValue(range as never);
  }

  /** The list this filter belongs to — `context`, typed as React's `List`. */
  public get list(): List<T> {
    return this.context as List<T>;
  }
}
