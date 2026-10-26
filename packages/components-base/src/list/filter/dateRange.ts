import {
  CalendarDate,
  CalendarDateTime,
  ZonedDateTime,
} from "@internationalized/date";
import type { ColumnDef, Row } from "@tanstack/table-core";
import { DateTime } from "luxon";

/**
 * A calendar date, in whichever shape it reached the filter — with a time of
 * day when the filter narrows down by minute.
 */
export interface ListDateParts {
  readonly year: number;
  readonly month: number;
  readonly day: number;
  readonly hour?: number;
  readonly minute?: number;
  readonly second?: number;
}

export interface ListDateRange {
  readonly start?: ListDateParts;
  readonly end?: ListDateParts;
}

/** A range needs both ends present to be one, even if either may be unset. */
export const isListDateRange = (value: unknown): value is ListDateRange =>
  !!value && typeof value === "object" && "start" in value && "end" in value;

const hasTime = (date: ListDateParts) => "hour" in date;

/**
 * The date as a local point in time. A `ZonedDateTime` is the instant it names;
 * anything else is read field by field, since after crossing the remote
 * boundary a `CalendarDate` is a plain object.
 */
export const listDateToDateTime = (date: ListDateParts): DateTime =>
  date instanceof ZonedDateTime
    ? DateTime.fromJSDate(date.toDate())
    : DateTime.fromObject({
        year: date.year,
        month: date.month,
        day: date.day,
        ...(hasTime(date)
          ? { hour: date.hour, minute: date.minute, second: date.second }
          : {}),
      });

/**
 * Resolves a range to the instants it spans, for filtering on the server side.
 * Both bounds are inclusive: a date covers its whole day and a date with time
 * its whole minute, in the user's local time zone. A missing side has no
 * bound.
 */
export const resolveListDateRange = (
  range: ListDateRange,
): { start?: Date; end?: Date } => {
  const unit = (date: ListDateParts) => (hasTime(date) ? "minute" : "day");

  return {
    start: range.start
      ? listDateToDateTime(range.start).startOf(unit(range.start)).toJSDate()
      : undefined,
    end: range.end
      ? listDateToDateTime(range.end).endOf(unit(range.end)).toJSDate()
      : undefined,
  };
};

/**
 * The cell's value as a point in time, or `undefined` when the filter does not
 * treat it as a date.
 *
 * A luxon `DateTime` and an ISO 8601 string are compared as the instant they
 * name — a date-only string as the start of its day. A `CalendarDate` counts as
 * the start of its day, a `CalendarDateTime` as its local time and a
 * `ZonedDateTime` as its instant. Anything else, a plain `{ year, month, day }`
 * object included, is not a date here.
 */
const toDateTime = (value: unknown): DateTime | undefined => {
  if (value instanceof DateTime) {
    return value;
  }
  if (
    value instanceof CalendarDate ||
    value instanceof CalendarDateTime ||
    value instanceof ZonedDateTime
  ) {
    return listDateToDateTime(value);
  }
  if (typeof value === "string") {
    return DateTime.fromISO(value);
  }
  return undefined;
};

/**
 * Whether a row's date falls inside the selected range.
 *
 * A value that is not a date keeps its row: a filter the data cannot answer
 * should not empty the list. That includes a string luxon cannot parse — the
 * invalid `DateTime` compares as `NaN`, and neither end excludes it.
 */
export const dateRangeFilterFn = <T>(
  row: Row<T>,
  columnId: string,
  range?: ListDateRange,
): boolean => {
  if (!range) {
    return true;
  }

  const dateValue = toDateTime(row.getValue(columnId));

  if (!dateValue) {
    return true;
  }

  const { start, end } = resolveListDateRange(range);

  if (start && dateValue.toMillis() < start.getTime()) {
    return false;
  }

  return !(end && dateValue.toMillis() > end.getTime());
};

/** Turns the column into one a date range filters. */
export const applyDateRangeColumnDef = <T>(def: ColumnDef<T>): void => {
  def.enableColumnFilter = true;
  def.filterFn = dateRangeFilterFn;
};
