import { DateTime } from "luxon";
import {
  CalendarDate,
  CalendarDateTime,
  ZonedDateTime,
} from "@internationalized/date";
import type { Row } from "@tanstack/react-table";
import type { DateRangeFilterValue } from "@/components/List/model/filter/types";
import {
  dateValueToLocalDateTime,
  resolveDateRangeFilterValue,
} from "@/components/List/model/filter/resolveDateRangeFilterValue";

export function dateRangeFilterFn<T>(
  row: Row<T>,
  columnId: string,
  range?: DateRangeFilterValue,
): boolean {
  if (!range) {
    return true;
  }

  const value = row.getValue(columnId);

  let dateValue;

  if (value instanceof DateTime) {
    dateValue = value;
  } else if (
    value instanceof CalendarDate ||
    value instanceof CalendarDateTime ||
    value instanceof ZonedDateTime
  ) {
    dateValue = dateValueToLocalDateTime(value);
  } else if (typeof value === "string") {
    dateValue = DateTime.fromISO(value);
  }

  if (!dateValue) {
    return true;
  }

  const { start, end } = resolveDateRangeFilterValue(range);

  if (start && dateValue.toMillis() < start.getTime()) {
    return false;
  }

  return !(end && dateValue.toMillis() > end.getTime());
}
