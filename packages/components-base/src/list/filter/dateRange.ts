import { CalendarDate } from "@internationalized/date";
import type { ColumnDef, Row } from "@tanstack/table-core";
import { DateTime } from "luxon";

/** A calendar date, in whichever shape it reached the filter. */
export interface ListDateParts {
  readonly year: number;
  readonly month: number;
  readonly day: number;
}

export interface ListDateRange {
  readonly start?: ListDateParts;
  readonly end?: ListDateParts;
}

/** A range needs both ends present to be one, even if either may be unset. */
export const isListDateRange = (value: unknown): value is ListDateRange =>
  !!value && typeof value === "object" && "start" in value && "end" in value;

/*
 * The range's ends are read field by field: they come from the calendar, and
 * after crossing the remote boundary a `CalendarDate` is a plain object.
 */
const startOfDay = (date: ListDateParts): DateTime =>
  DateTime.fromObject({
    year: date.year,
    month: date.month,
    day: date.day,
  });

/**
 * The cell's value as a point in time, or `undefined` when the filter does not
 * treat it as a date.
 *
 * Three shapes count, each on its own terms: a luxon `DateTime` and an ISO 8601
 * string are compared as the instant they name — a date-only string as the
 * start of its day — and a `CalendarDate` as its day. Anything else, a plain `{
 * year, month, day }` object included, is not a date here.
 */
const toDateTime = (value: unknown): DateTime | undefined => {
  if (value instanceof DateTime) {
    return value;
  }
  if (value instanceof CalendarDate) {
    return startOfDay(value);
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

  const startDate = range.start ? startOfDay(range.start) : undefined;
  /* The whole end day counts, up to its last moment. */
  const endDate = range.end ? startOfDay(range.end).endOf("day") : undefined;

  if (startDate && dateValue < startDate) {
    return false;
  }

  return !(endDate && dateValue > endDate);
};

/** Turns the column into one a date range filters. */
export const applyDateRangeColumnDef = <T>(def: ColumnDef<T>): void => {
  def.enableColumnFilter = true;
  def.filterFn = dateRangeFilterFn;
};
