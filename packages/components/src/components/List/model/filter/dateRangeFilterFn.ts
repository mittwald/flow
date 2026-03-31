import { DateTime } from "luxon";
import { CalendarDate } from "@internationalized/date";
import type { Row } from "@tanstack/react-table";
import { transformDateValueToDateTime } from "@/lib/date/transformDateValueToDateTime";

export function dateRangeFilterFn<T>(
  row: Row<T>,
  columnId: string,
  range?: { start?: CalendarDate; end?: CalendarDate },
): boolean {
  if (!range) {
    return true;
  }

  const value = row.getValue(columnId);

  let dateValue;

  if (value instanceof DateTime) {
    dateValue = value;
  } else if (value instanceof CalendarDate) {
    dateValue = transformDateValueToDateTime(value);
  } else if (typeof value === "string") {
    dateValue = DateTime.fromISO(value).startOf("day");
  }

  if (!dateValue) {
    return true;
  }

  const startDate = range.start
    ? transformDateValueToDateTime(range.start)
    : undefined;

  const endDate = range.end
    ? transformDateValueToDateTime(range.end)
    : undefined;

  if (startDate && dateValue < startDate) {
    return false;
  }

  return !(endDate && dateValue > endDate);
}
