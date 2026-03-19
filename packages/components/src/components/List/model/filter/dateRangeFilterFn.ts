import { DateTime } from "luxon";
import type { CalendarDate } from "@internationalized/date";
import type { Row } from "@tanstack/react-table";

export function dateRangeFilterFn<T>(
  row: Row<T>,
  columnId: string,
  range?: { start?: CalendarDate; end?: CalendarDate },
): boolean {
  const value = row.getValue(columnId);

  if (typeof value !== "string" || !range) {
    return true;
  }

  const dateValue = DateTime.fromISO(value).startOf("day");

  const startDate = range.start
    ? DateTime.fromObject({
        year: range.start.year,
        month: range.start.month,
        day: range.start.day,
      }).startOf("day")
    : undefined;

  const endDate = range.end
    ? DateTime.fromObject({
        year: range.end.year,
        month: range.end.month,
        day: range.end.day,
      }).startOf("day")
    : undefined;

  if (startDate && dateValue < startDate) return false;
  if (endDate && dateValue > endDate) return false;

  return true;
}
