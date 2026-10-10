import type { ColumnDef } from "@tanstack/react-table";
import type List from "@/components/List/model/List";
import { Filter } from "./Filter";
import type {
  DateRangeFilterOptions,
  DateRangeFilterValue,
  FilterShape,
} from "@/components/List/model/filter/types";
import type { PropertyName } from "@/components/List/model/types";
import { dateRangeFilterFn } from "@/components/List/model/filter/dateRangeFilterFn";
import type { RangeCalendarProps } from "@/components/Calendar";
import { omit } from "remeda";

const isDateRangeFilterValue = (
  value: unknown,
): value is DateRangeFilterValue =>
  !!value &&
  typeof value === "object" &&
  !Array.isArray(value) &&
  ("start" in value || "end" in value);

export class DateRangeFilter<
  T = never,
  TProp extends PropertyName<T> = never,
> extends Filter<T, TProp> {
  public readonly dateRangeOptions?: DateRangeFilterOptions;

  public constructor(list: List<T>, shape: FilterShape<T, TProp, never>) {
    super(list, shape);
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

  public override updateTableColumnDef(def: ColumnDef<T>): void {
    def.enableColumnFilter = true;
    def.filterFn = dateRangeFilterFn;
  }

  public override getValue(): DateRangeFilterValue | null {
    const value = this.getTableColumnFilter()?.value;
    return isDateRangeFilterValue(value) ? value : null;
  }

  public setValue(range: DateRangeFilterValue) {
    this.list.reactTable.getTableColumn(this.property).setFilterValue(range);
  }
}
