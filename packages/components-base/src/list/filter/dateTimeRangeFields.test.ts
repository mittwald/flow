import { describe, expect, test } from "vitest";
import { CalendarDate, CalendarDateTime, Time } from "@internationalized/date";
import {
  getListDateTimeRangeUpdate,
  isListDateTimeRangeEndBeforeStart,
  listDateTimeRangeFieldsFromValue,
  type ListDateTimeRangeFields,
} from "./dateTimeRangeFields";

const empty: ListDateTimeRangeFields = {
  startDate: null,
  startTime: null,
  endDate: null,
  endTime: null,
};

const day = (dayOfMonth: number) => new CalendarDate(2026, 3, dayOfMonth);

describe("listDateTimeRangeFieldsFromValue", () => {
  test("splits each end into its date and time", () => {
    expect(
      listDateTimeRangeFieldsFromValue({
        start: new CalendarDateTime(2026, 3, 10, 8, 30),
        end: day(12),
      }),
    ).toEqual({
      startDate: day(10),
      startTime: new Time(8, 30),
      endDate: day(12),
      endTime: null,
    });
  });

  test("reads a value that crossed the remote boundary", () => {
    const fields = listDateTimeRangeFieldsFromValue({
      start: { year: 2026, month: 3, day: 10, hour: 8, minute: 30 },
      end: undefined,
    });
    expect(fields.startDate).toEqual(day(10));
    expect(fields.startTime).toEqual(new Time(8, 30));
  });

  test("leaves every field empty without a value", () => {
    expect(listDateTimeRangeFieldsFromValue(null)).toEqual(empty);
  });
});

describe("getListDateTimeRangeUpdate", () => {
  test("combines date and time", () => {
    expect(
      getListDateTimeRangeUpdate(
        {
          ...empty,
          startDate: day(10),
          startTime: new Time(8),
          endDate: day(12),
        },
        null,
      ),
    ).toEqual({
      start: new CalendarDateTime(2026, 3, 10, 8, 0),
      end: day(12),
    });
  });

  test("clears the filter once every date is gone", () => {
    expect(
      getListDateTimeRangeUpdate(empty, { start: day(10), end: undefined }),
    ).toBeNull();
  });

  test("ignores a time without its date", () => {
    expect(
      getListDateTimeRangeUpdate({ ...empty, startTime: new Time(8) }, null),
    ).toBeUndefined();
  });

  test("leaves an unchanged range alone", () => {
    expect(
      getListDateTimeRangeUpdate(
        { ...empty, startDate: day(10) },
        {
          start: { year: 2026, month: 3, day: 10 },
          end: undefined,
        },
      ),
    ).toBeUndefined();
  });

  test("keeps the last range while a year is still being typed", () => {
    expect(
      getListDateTimeRangeUpdate(
        { ...empty, startDate: new CalendarDate(202, 3, 10) },
        null,
      ),
    ).toBeUndefined();
  });

  test("keeps the last range for a date outside the limits", () => {
    const limits = {
      minValue: day(5),
      maxValue: day(20),
      isDateUnavailable: (date: CalendarDate) => date.day === 13,
    };
    expect(
      getListDateTimeRangeUpdate({ ...empty, startDate: day(4) }, null, limits),
    ).toBeUndefined();
    expect(
      getListDateTimeRangeUpdate({ ...empty, endDate: day(21) }, null, limits),
    ).toBeUndefined();
    expect(
      getListDateTimeRangeUpdate({ ...empty, endDate: day(13) }, null, limits),
    ).toBeUndefined();
    expect(
      getListDateTimeRangeUpdate({ ...empty, endDate: day(14) }, null, limits),
    ).toEqual({ start: undefined, end: day(14) });
  });

  test("keeps the last range while it ends before it starts", () => {
    const fields = {
      startDate: day(10),
      startTime: new Time(12),
      endDate: day(10),
      endTime: new Time(8),
    };
    expect(isListDateTimeRangeEndBeforeStart(fields)).toBe(true);
    expect(getListDateTimeRangeUpdate(fields, null)).toBeUndefined();
  });

  /* Typing the end year 2025 passes 2, 20 and 202 — none of them an error. */
  test("shows no range error while a year is still being typed", () => {
    expect(
      isListDateTimeRangeEndBeforeStart({
        startDate: day(10),
        startTime: null,
        endDate: new CalendarDate(202, 3, 10),
        endTime: null,
      }),
    ).toBe(false);
  });

  /* An end time covers its whole minute, so a range of one minute is valid. */
  test("accepts a start and end in the same minute", () => {
    const fields = {
      startDate: day(10),
      startTime: new Time(8),
      endDate: day(10),
      endTime: new Time(8),
    };
    expect(isListDateTimeRangeEndBeforeStart(fields)).toBe(false);
  });
});
