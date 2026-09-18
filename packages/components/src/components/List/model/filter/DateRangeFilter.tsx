import type { ColumnDef } from "@tanstack/react-table";
import { Filter } from "./Filter";
import type { ListModelContext } from "@mittwald/flow-components-base";
import type { FilterShape } from "@/components/List/model/filter/types";
import type { PropertyName } from "@/components/List/model/types";

import type { DateRange, RangeValue } from "react-aria-components";
import type { DateValue } from "@internationalized/date";
import {
  isDateRangeValue,
  type RangeCalendarProps,
} from "@/components/Calendar";
import { dateRangeFilterFn } from "@/components/List/model/filter/dateRangeFilterFn";

export class DateRangeFilter<
  T = never,
  TProp extends PropertyName<T> = never,
> extends Filter<T, TProp> {
  public readonly dateRangeOptions?: RangeCalendarProps;

  public constructor(
    context: ListModelContext<T>,
    shape: FilterShape<T, TProp, never>,
  ) {
    super(context, shape);
    this.dateRangeOptions = shape.dateRangeOptions;
  }

  public override updateTableColumnDef(def: ColumnDef<T>): void {
    def.enableColumnFilter = true;
    def.filterFn = dateRangeFilterFn;
  }

  public override getValue(): DateRange | null {
    const value = this.getTableColumnFilter()?.value;
    return isDateRangeValue(value) ? value : null;
  }

  public setValue(range: RangeValue<DateValue>) {
    this.getTableColumn().setFilterValue(range);
  }
}
