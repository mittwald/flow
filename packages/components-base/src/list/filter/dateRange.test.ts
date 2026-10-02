import { describe, expect, test } from "vitest";
import {
  CalendarDate,
  CalendarDateTime,
  parseZonedDateTime,
} from "@internationalized/date";
import { DateTime } from "luxon";
import { dateRangeFilterFn, isListDateRange } from "./dateRange";
import type { Row } from "@tanstack/table-core";

const row = (value: unknown) =>
  ({ getValue: () => value }) as unknown as Row<unknown>;

/* The range's ends arrive as plain objects once they crossed the boundary. */
const day = (year: number, month: number, dayOfMonth: number) => ({
  year,
  month,
  day: dayOfMonth,
});

const march = { start: day(2024, 3, 1), end: day(2024, 3, 31) };

describe("what counts as a date", () => {
  test("a CalendarDate is its day", () => {
    expect(
      dateRangeFilterFn(row(new CalendarDate(2024, 3, 15)), "d", march),
    ).toBe(true);
    expect(
      dateRangeFilterFn(row(new CalendarDate(2024, 4, 1)), "d", march),
    ).toBe(false);
  });

  test("a luxon DateTime is the instant it is", () => {
    expect(
      dateRangeFilterFn(row(DateTime.local(2024, 3, 31)), "d", march),
    ).toBe(true);
    expect(
      dateRangeFilterFn(row(DateTime.local(2024, 2, 29, 23, 59)), "d", march),
    ).toBe(false);
  });

  /*
   * The end is the start of the last day, and an instant is compared as such:
   * a time of day on the last day lies after it.
   */
  test("a luxon DateTime later on the last day falls outside", () => {
    expect(
      dateRangeFilterFn(row(DateTime.local(2024, 3, 31, 10)), "d", march),
    ).toBe(false);
  });

  test("an ISO string is the start of the day it names", () => {
    expect(dateRangeFilterFn(row("2024-03-01"), "d", march)).toBe(true);
    expect(dateRangeFilterFn(row("2024-02-29"), "d", march)).toBe(false);
    expect(dateRangeFilterFn(row("2024-03-31T10:00:00"), "d", march)).toBe(
      true,
    );
    expect(dateRangeFilterFn(row("2024-W14-1"), "d", march)).toBe(false);
  });

  /* A filter the data cannot answer must not empty the list. */
  test("a string luxon cannot read as ISO keeps its row", () => {
    expect(dateRangeFilterFn(row("2024/04/05"), "d", march)).toBe(true);
    expect(dateRangeFilterFn(row("not a date"), "d", march)).toBe(true);
  });

  test("any other shape keeps its row", () => {
    expect(dateRangeFilterFn(row(day(2024, 4, 1)), "d", march)).toBe(true);
    expect(
      dateRangeFilterFn(row(new CalendarDateTime(2024, 4, 1)), "d", march),
    ).toBe(true);
    expect(
      dateRangeFilterFn(
        row(parseZonedDateTime("2024-04-01T00:00[Europe/Berlin]")),
        "d",
        march,
      ),
    ).toBe(true);
    expect(dateRangeFilterFn(row(new Date(2024, 3, 1)), "d", march)).toBe(true);
    expect(dateRangeFilterFn(row(42), "d", march)).toBe(true);
    expect(dateRangeFilterFn(row(null), "d", march)).toBe(true);
  });
});

describe("the range itself", () => {
  test("no range keeps everything", () => {
    expect(
      dateRangeFilterFn(row(new CalendarDate(1999, 1, 1)), "d", undefined),
    ).toBe(true);
  });

  test("one open end is a half-open range", () => {
    const fromMarch = { start: day(2024, 3, 1), end: undefined };
    expect(
      dateRangeFilterFn(row(new CalendarDate(2030, 1, 1)), "d", fromMarch),
    ).toBe(true);
    expect(
      dateRangeFilterFn(row(new CalendarDate(2024, 2, 1)), "d", fromMarch),
    ).toBe(false);
  });

  test("both ends are inclusive for a day", () => {
    expect(
      dateRangeFilterFn(row(new CalendarDate(2024, 3, 1)), "d", march),
    ).toBe(true);
    expect(
      dateRangeFilterFn(row(new CalendarDate(2024, 3, 31)), "d", march),
    ).toBe(true);
  });
});

test("a range is recognised by having both ends, set or not", () => {
  expect(isListDateRange({ start: undefined, end: undefined })).toBe(true);
  expect(isListDateRange({ start: day(2024, 1, 1) })).toBe(false);
  expect(isListDateRange(null)).toBe(false);
});
