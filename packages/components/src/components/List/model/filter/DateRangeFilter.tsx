import { ListDateRangeFilter } from "@mittwald/flow-components-base";
import type { ListModelContext } from "@mittwald/flow-components-base";
import type {
  DateRangeFilterOptions,
  DateRangeFilterValue,
  FilterShape,
} from "@/components/List/model/filter/types";
import type { PropertyName } from "@/components/List/model/types";
import type { RangeCalendarProps } from "@/components/Calendar";
import type { ReactNode } from "react";
import { omit } from "remeda";
import type { List } from "@/components/List/model/List";
import type { FilterValue } from "@/components/List/model/filter/FilterValue";

/**
 * React's date-range filter.
 *
 * The column, the comparison and the stored value are `ListDateRangeFilter` in
 * `@mittwald/flow-components-base`, so the Vue binding filters the same dates
 * the same way. What is left here are the options of the fields that pick the
 * range: Flow's `RangeCalendar` props, or with `granularity: "minute"` those of
 * the date and time fields.
 */
export class DateRangeFilter<
  T = never,
  TProp extends PropertyName<T> = never,
> extends ListDateRangeFilter<T, TProp, ReactNode> {
  public readonly dateRangeOptions?: DateRangeFilterOptions;

  public constructor(
    context: ListModelContext<T>,
    shape: FilterShape<T, TProp, never>,
  ) {
    super(context, shape as never);
    this.dateRangeOptions = shape.dateRangeOptions;
  }

  public get granularity(): "day" | "minute" {
    return this.dateRangeOptions?.granularity ?? "day";
  }

  public get rangeCalendarProps(): RangeCalendarProps {
    const options = this.dateRangeOptions ?? {};
    return options.granularity === "minute"
      ? {}
      : omit(options, ["granularity"]);
  }

  public get dateTimeRangeOptions() {
    const options = this.dateRangeOptions;
    return options?.granularity === "minute" ? options : undefined;
  }

  /*
   * Narrowed back to `@internationalized/date`'s types, because that is what
   * the calendar and the date fields take. The shared class is typed on the
   * numbers a date is made of, which every date library agrees on and nothing
   * else does.
   */
  public override getValue(): DateRangeFilterValue | null {
    return super.getValue() as DateRangeFilterValue | null;
  }

  public override setValue(range: DateRangeFilterValue | null): void {
    super.setValue(range);
  }

  /** The list this filter belongs to — `context`, typed as React's `List`. */
  public get list(): List<T> {
    return this.context as List<T>;
  }

  /* As in `Filter`: created by this filter, so each one's `filter` is React's. */
  public override get values(): FilterValue[] {
    return super.values as FilterValue[];
  }

  public override getArrayValue(): FilterValue[] {
    return super.getArrayValue() as FilterValue[];
  }
}
