import { ListFilter } from "./ListFilter";
import {
  applyDateRangeColumnDef,
  isListDateRange,
  type ListDateRange,
} from "./dateRange";
import type { PropertyName } from "../types";
import type { ColumnDef } from "@tanstack/table-core";

/**
 * A filter over a span of days rather than over a set of values.
 *
 * Everything except the control that picks the range: the table column, the
 * comparison and the stored value are the same in every binding, and what a
 * calendar looks like is not. A binding subclasses this to add its own calendar
 * options.
 */
export class ListDateRangeFilter<
  T = never,
  TProp extends PropertyName<T> = never,
  TRendered = unknown,
> extends ListFilter<T, TProp, never, TRendered> {
  public override updateTableColumnDef(def: ColumnDef<T>): void {
    applyDateRangeColumnDef(def);
  }

  public override getValue(): ListDateRange | null {
    const value = super.getValue();
    return isListDateRange(value) ? value : null;
  }

  public setValue(range: ListDateRange | null): void {
    this.getTableColumn().setFilterValue(range);
  }
}

export default ListDateRangeFilter;
