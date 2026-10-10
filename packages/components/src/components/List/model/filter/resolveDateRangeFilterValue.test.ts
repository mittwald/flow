import { describe, expect, test } from "vitest";
import {
  CalendarDate,
  CalendarDateTime,
  ZonedDateTime,
} from "@internationalized/date";
import { resolveDateRangeFilterValue } from "@/components/List/model/filter/resolveDateRangeFilterValue";

describe("resolveDateRangeFilterValue", () => {
  test("resolves dates to their whole days in local time", () => {
    expect(
      resolveDateRangeFilterValue({
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
      resolveDateRangeFilterValue({
        start: new CalendarDateTime(2026, 10, 1, 22, 0, 30),
        end: new CalendarDateTime(2026, 10, 2, 6, 0),
      }),
    ).toEqual({
      start: new Date(2026, 9, 1, 22, 0, 0, 0),
      end: new Date(2026, 9, 2, 6, 0, 59, 999),
    });
  });

  test("resolves a zoned date by its instant", () => {
    const { start } = resolveDateRangeFilterValue({
      start: new ZonedDateTime(2026, 10, 1, "UTC", 0, 12, 0),
    });
    expect(start?.toISOString()).toBe("2026-10-01T12:00:00.000Z");
  });

  test("leaves a missing side without bound", () => {
    expect(
      resolveDateRangeFilterValue({ start: new CalendarDate(2026, 10, 1) }),
    ).toEqual({ start: new Date(2026, 9, 1), end: undefined });
    expect(resolveDateRangeFilterValue({})).toEqual({
      start: undefined,
      end: undefined,
    });
  });
});
