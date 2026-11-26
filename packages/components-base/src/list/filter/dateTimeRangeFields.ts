import {
  CalendarDate,
  type CalendarDateTime,
  Time,
  toCalendarDateTime,
} from "@internationalized/date";
import {
  resolveListDateRange,
  type ListDateParts,
  type ListDateRange,
} from "./dateRange";

/*
 * The rules of the date and time fields a range filter shows with
 * `granularity: "minute"`. Which input is valid and when it applies is the same
 * in every binding; the fields and the state holding their input are not.
 */

export interface ListDateTimeRangeFields {
  readonly startDate: CalendarDate | null;
  readonly startTime: Time | null;
  readonly endDate: CalendarDate | null;
  readonly endTime: Time | null;
}

export interface ListDateTimeRangeLimits {
  readonly minValue?: ListDateParts | null;
  readonly maxValue?: ListDateParts | null;
  readonly isDateUnavailable?: (date: CalendarDate) => boolean;
}

type Bound = CalendarDate | CalendarDateTime;

export interface ListDateTimeRange {
  readonly start?: Bound;
  readonly end?: Bound;
}

/* Field by field: a value from the host of a remote connection is a plain object. */
export const toListCalendarDate = (
  value?: ListDateParts | null,
): CalendarDate | null =>
  value ? new CalendarDate(value.year, value.month, value.day) : null;

export const toListTime = (
  value?: { readonly hour?: number; readonly minute?: number } | null,
): Time | null =>
  value && "hour" in value ? new Time(value.hour, value.minute) : null;

export const listDateTimeRangeFieldsFromValue = (
  value: ListDateRange | null,
): ListDateTimeRangeFields => ({
  startDate: toListCalendarDate(value?.start),
  startTime: toListTime(value?.start),
  endDate: toListCalendarDate(value?.end),
  endTime: toListTime(value?.end),
});

const toBound = (date: CalendarDate | null, time: Time | null) =>
  date ? (time ? toCalendarDateTime(date, time) : date) : undefined;

const boundKey = (bound?: ListDateParts) =>
  bound &&
  [bound.year, bound.month, bound.day, bound.hour, bound.minute].join("-");

// react-aria reports a typed year digit by digit (2, 20, 202, 2026)
const isYearComplete = (date: CalendarDate | null) =>
  !!date && date.year >= 1000;

/** Not while a year is still being typed: "2" would read as an early end. */
export const isListDateTimeRangeEndBeforeStart = (
  fields: ListDateTimeRangeFields,
): boolean => {
  if (!isYearComplete(fields.startDate) || !isYearComplete(fields.endDate)) {
    return false;
  }
  const { start, end } = resolveListDateRange({
    start: toBound(fields.startDate, fields.startTime),
    end: toBound(fields.endDate, fields.endTime),
  });
  return !!start && !!end && end < start;
};

export const isListDateValid = (
  date: CalendarDate | null,
  limits: ListDateTimeRangeLimits = {},
): boolean => {
  const minValue = toListCalendarDate(limits.minValue);
  const maxValue = toListCalendarDate(limits.maxValue);

  return (
    !date ||
    !(
      !isYearComplete(date) ||
      (minValue && date.compare(minValue) < 0) ||
      (maxValue && date.compare(maxValue) > 0) ||
      limits.isDateUnavailable?.(date)
    )
  );
};

/**
 * The range the fields stand for, or `undefined` while it must not be applied:
 * an invalid input keeps the last valid range, and an unchanged one needs no
 * update. `null` clears the filter.
 */
export const getListDateTimeRangeUpdate = (
  fields: ListDateTimeRangeFields,
  applied: ListDateRange | null,
  limits?: ListDateTimeRangeLimits,
): ListDateTimeRange | null | undefined => {
  if (
    !isListDateValid(fields.startDate, limits) ||
    !isListDateValid(fields.endDate, limits) ||
    isListDateTimeRangeEndBeforeStart(fields)
  ) {
    return undefined;
  }

  const start = toBound(fields.startDate, fields.startTime);
  const end = toBound(fields.endDate, fields.endTime);

  if (
    boundKey(start) === boundKey(applied?.start) &&
    boundKey(end) === boundKey(applied?.end)
  ) {
    return undefined;
  }

  return start || end ? { start, end } : null;
};
