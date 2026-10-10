import { describe, expect, test } from "vitest";
import {
  CalendarDate,
  CalendarDateTime,
  parseDate,
} from "@internationalized/date";
import type { Row } from "@tanstack/react-table";
import { DateTime } from "luxon";
import { dateRangeFilterFn } from "@/components/List/model/filter/dateRangeFilterFn";

interface Moment {
  date: string;
  time?: string;
}

const row = (value: unknown) =>
  ({ getValue: () => value }) as unknown as Row<unknown>;

const valueTypes: Record<string, (moment: Moment) => unknown> = {
  DateTime: ({ date, time = "00:00:00.000" }) =>
    DateTime.fromISO(`${date}T${time}`),
  "ISO string with time": ({ date, time = "00:00:00.000" }) =>
    `${date}T${time}`,
};

const dateOnlyValueTypes: Record<string, (moment: Moment) => unknown> = {
  ...valueTypes,
  "ISO date-only string": ({ date }) => date,
  CalendarDate: ({ date }) => parseDate(date),
};

const range = {
  start: new CalendarDate(2026, 3, 10),
  end: new CalendarDate(2026, 3, 12),
};

const matches = (
  value: unknown,
  filterRange: Parameters<typeof dateRangeFilterFn>[2],
) => dateRangeFilterFn(row(value), "date", filterRange);

describe.each(Object.entries(dateOnlyValueTypes))("%s", (_, toValue) => {
  test("excludes the day before the start", () => {
    expect(matches(toValue({ date: "2026-03-09" }), range)).toBe(false);
  });

  test("includes the start day", () => {
    expect(matches(toValue({ date: "2026-03-10" }), range)).toBe(true);
  });

  test("includes the end day", () => {
    expect(matches(toValue({ date: "2026-03-12" }), range)).toBe(true);
  });

  test("excludes the day after the end", () => {
    expect(matches(toValue({ date: "2026-03-13" }), range)).toBe(false);
  });

  test("has no upper bound without an end", () => {
    const openEnd = { start: range.start };
    expect(matches(toValue({ date: "2026-03-09" }), openEnd)).toBe(false);
    expect(matches(toValue({ date: "2030-01-01" }), openEnd)).toBe(true);
  });

  test("has no lower bound without a start", () => {
    const openStart = { end: range.end };
    expect(matches(toValue({ date: "2000-01-01" }), openStart)).toBe(true);
    expect(matches(toValue({ date: "2026-03-13" }), openStart)).toBe(false);
  });

  test("includes everything without a range", () => {
    expect(matches(toValue({ date: "2026-03-13" }), undefined)).toBe(true);
    expect(matches(toValue({ date: "2026-03-13" }), {})).toBe(true);
  });
});

describe.each(Object.entries(valueTypes))("%s", (_, toValue) => {
  test("excludes the last moment of the day before the start", () => {
    expect(
      matches(toValue({ date: "2026-03-09", time: "23:59:59.999" }), range),
    ).toBe(false);
  });

  test.each(["14:00:00.000", "23:59:00.000", "23:59:59.999"])(
    "includes the end day at %s",
    (time) => {
      expect(matches(toValue({ date: "2026-03-12", time }), range)).toBe(true);
    },
  );

  test("includes a start day with time on a single-day range", () => {
    const singleDay = { start: range.end, end: range.end };
    expect(
      matches(toValue({ date: "2026-03-12", time: "14:00:00.000" }), singleDay),
    ).toBe(true);
  });
});

test("compares a DateTime in another zone by its instant", () => {
  const endDayAfternoon = DateTime.fromISO("2026-03-12T14:00:00").setZone(
    "UTC+14",
  );
  const dayAfterEnd = DateTime.fromISO("2026-03-13T00:00:00").setZone("UTC-12");

  expect(matches(endDayAfternoon, range)).toBe(true);
  expect(matches(dayAfterEnd, range)).toBe(false);
});

describe("range with time", () => {
  const timeRange = {
    start: new CalendarDateTime(2026, 3, 10, 8, 0),
    end: new CalendarDateTime(2026, 3, 10, 12, 0),
  };

  test.each([
    ["07:59:59.999", false],
    ["08:00:00.000", true],
    ["12:00:59.999", true],
    ["12:01:00.000", false],
  ])("matches 2026-03-10 at %s: %s", (time, expected) => {
    expect(matches(`2026-03-10T${time}`, timeRange)).toBe(expected);
  });

  test("combines a time with a whole day", () => {
    const mixed = {
      start: timeRange.start,
      end: new CalendarDate(2026, 3, 11),
    };
    expect(matches("2026-03-10T07:00:00", mixed)).toBe(false);
    expect(matches("2026-03-11T23:30:00", mixed)).toBe(true);
  });

  test("compares CalendarDateTime row values", () => {
    expect(matches(new CalendarDateTime(2026, 3, 10, 9, 30), timeRange)).toBe(
      true,
    );
    expect(matches(new CalendarDateTime(2026, 3, 10, 13, 0), timeRange)).toBe(
      false,
    );
  });
});
