import { DateTime } from "luxon";
import { CalendarDate } from "@internationalized/date";
import type { Row } from "@tanstack/react-table";

export function dateRangeFilterFn<T>(
  row: Row<T>,
  columnId: string,
  range?: { start?: CalendarDate; end?: CalendarDate },
): boolean {
  const value = row.getValue(columnId);

  if (!range) {
    return true;
  }

  let dateValue;

  if (value instanceof DateTime) {
    dateValue = value;
  }

  if (value instanceof CalendarDate) {
    dateValue = DateTime.fromObject({
      year: value.year,
      month: value.month,
      day: value.day,
    });
  }

  if (typeof value === "string") {
    dateValue = DateTime.fromISO(value).startOf("day");
  }

  if (!dateValue) {
    return true;
  }

  const startDate = range.start
    ? DateTime.fromObject({
        year: range.start.year,
        month: range.start.month,
        day: range.start.day,
      })
    : undefined;

  const endDate = range.end
    ? DateTime.fromObject({
        year: range.end.year,
        month: range.end.month,
        day: range.end.day,
      })
    : undefined;

  if (startDate && dateValue < startDate) return false;
  if (endDate && dateValue > endDate) return false;

  return true;
}
