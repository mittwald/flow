import { describe, expect, test } from "vitest";
import {
  CalendarDate,
  CalendarDateTime,
  parseDate,
  parseZonedDateTime,
  ZonedDateTime,
} from "@internationalized/date";
import { DateTime } from "luxon";
import {
  dateRangeFilterFn,
  isListDateRange,
  resolveListDateRange,
} from "./dateRange";
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

  /* The whole end day counts, so a time of day on it is inside. */
  test("a luxon DateTime later on the last day is inside", () => {
    expect(
      dateRangeFilterFn(row(DateTime.local(2024, 3, 31, 10)), "d", march),
    ).toBe(true);
    expect(dateRangeFilterFn(row(DateTime.local(2024, 4, 1)), "d", march)).toBe(
      false,
    );
  });

  test("a CalendarDateTime is its local time", () => {
    expect(
      dateRangeFilterFn(row(new CalendarDateTime(2024, 3, 31, 23)), "d", march),
    ).toBe(true);
    expect(
      dateRangeFilterFn(row(new CalendarDateTime(2024, 4, 1)), "d", march),
    ).toBe(false);
  });

  test("a ZonedDateTime is the instant it names", () => {
    expect(
      dateRangeFilterFn(
        row(parseZonedDateTime("2024-03-15T12:00[Europe/Berlin]")),
        "d",
        march,
      ),
    ).toBe(true);
    expect(
      dateRangeFilterFn(
        row(parseZonedDateTime("2024-04-15T12:00[Europe/Berlin]")),
        "d",
        march,
      ),
    ).toBe(false);
  });

  test("an ISO string is the moment it names", () => {
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

/*
 * Every shape a cell can hold, against one three-day range: the whole end day
 * counts, up to its last moment, whatever time of day a value carries.
 */
describe("the whole end day", () => {
  interface Moment {
    date: string;
    time?: string;
  }

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

  const endDayRange = {
    start: new CalendarDate(2026, 3, 10),
    end: new CalendarDate(2026, 3, 12),
  };

  const matches = (
    value: unknown,
    filterRange: Parameters<typeof dateRangeFilterFn>[2],
  ) => dateRangeFilterFn(row(value), "date", filterRange);

  describe.each(Object.entries(dateOnlyValueTypes))("%s", (_, toValue) => {
    test("excludes the day before the start", () => {
      expect(matches(toValue({ date: "2026-03-09" }), endDayRange)).toBe(false);
    });

    test("includes the start day", () => {
      expect(matches(toValue({ date: "2026-03-10" }), endDayRange)).toBe(true);
    });

    test("includes the end day", () => {
      expect(matches(toValue({ date: "2026-03-12" }), endDayRange)).toBe(true);
    });

    test("excludes the day after the end", () => {
      expect(matches(toValue({ date: "2026-03-13" }), endDayRange)).toBe(false);
    });

    test("has no upper bound without an end", () => {
      const openEnd = { start: endDayRange.start };
      expect(matches(toValue({ date: "2026-03-09" }), openEnd)).toBe(false);
      expect(matches(toValue({ date: "2030-01-01" }), openEnd)).toBe(true);
    });

    test("has no lower bound without a start", () => {
      const openStart = { end: endDayRange.end };
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
        matches(
          toValue({ date: "2026-03-09", time: "23:59:59.999" }),
          endDayRange,
        ),
      ).toBe(false);
    });

    test.each(["14:00:00.000", "23:59:00.000", "23:59:59.999"])(
      "includes the end day at %s",
      (time) => {
        expect(
          matches(toValue({ date: "2026-03-12", time }), endDayRange),
        ).toBe(true);
      },
    );

    test("includes a start day with time on a single-day range", () => {
      const singleDay = { start: endDayRange.end, end: endDayRange.end };
      expect(
        matches(
          toValue({ date: "2026-03-12", time: "14:00:00.000" }),
          singleDay,
        ),
      ).toBe(true);
    });
  });

  test("compares a DateTime in another zone by its instant", () => {
    const endDayAfternoon = DateTime.fromISO("2026-03-12T14:00:00").setZone(
      "UTC+14",
    );
    const dayAfterEnd = DateTime.fromISO("2026-03-13T00:00:00").setZone(
      "UTC-12",
    );

    expect(matches(endDayAfternoon, endDayRange)).toBe(true);
    expect(matches(dayAfterEnd, endDayRange)).toBe(false);
  });
});

describe("a range with time", () => {
  const timeRange = {
    start: new CalendarDateTime(2026, 3, 10, 8, 0),
    end: new CalendarDateTime(2026, 3, 10, 12, 0),
  };

  /* The end time covers its whole minute. */
  test.each([
    ["07:59:59.999", false],
    ["08:00:00.000", true],
    ["12:00:59.999", true],
    ["12:01:00.000", false],
  ])("matches 2026-03-10 at %s: %s", (time, expected) => {
    expect(dateRangeFilterFn(row(`2026-03-10T${time}`), "d", timeRange)).toBe(
      expected,
    );
  });

  test("combines a time with a whole day", () => {
    const mixed = {
      start: timeRange.start,
      end: new CalendarDate(2026, 3, 11),
    };
    expect(dateRangeFilterFn(row("2026-03-10T07:00:00"), "d", mixed)).toBe(
      false,
    );
    expect(dateRangeFilterFn(row("2026-03-11T23:30:00"), "d", mixed)).toBe(
      true,
    );
  });

  test("reads a time that crossed the boundary field by field", () => {
    const plain = {
      start: { year: 2026, month: 3, day: 10, hour: 8, minute: 0, second: 0 },
      end: { year: 2026, month: 3, day: 10, hour: 12, minute: 0, second: 0 },
    };
    expect(dateRangeFilterFn(row("2026-03-10T07:59:00"), "d", plain)).toBe(
      false,
    );
    expect(dateRangeFilterFn(row("2026-03-10T12:00:30"), "d", plain)).toBe(
      true,
    );
  });
});

describe("resolveListDateRange", () => {
  test("resolves dates to their whole days in local time", () => {
    expect(
      resolveListDateRange({
        start: new CalendarDate(2026, 10, 1),
        end: new CalendarDate(2026, 10, 2),
      }),
    ).toEqual({
      start: new Date(2026, 9, 1, 0, 0, 0, 0),
      end: new Date(2026, 9, 2, 23, 59, 59, 999),
    });
  });

  test("resolves dates with time to their whole minutes", () => {
    expect(
      resolveListDateRange({
        start: new CalendarDateTime(2026, 10, 1, 22, 0, 30),
        end: new CalendarDateTime(2026, 10, 2, 6, 0),
      }),
    ).toEqual({
      start: new Date(2026, 9, 1, 22, 0, 0, 0),
      end: new Date(2026, 9, 2, 6, 0, 59, 999),
    });
  });

  test("resolves a zoned date by its instant", () => {
    const { start } = resolveListDateRange({
      start: new ZonedDateTime(2026, 10, 1, "UTC", 0, 12, 0),
    });
    expect(start?.toISOString()).toBe("2026-10-01T12:00:00.000Z");
  });

  test("leaves a missing side without bound", () => {
    expect(
      resolveListDateRange({ start: new CalendarDate(2026, 10, 1) }),
    ).toEqual({ start: new Date(2026, 9, 1), end: undefined });
    expect(resolveListDateRange({})).toEqual({
      start: undefined,
      end: undefined,
    });
  });
});
