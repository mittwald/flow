import { describe, expect, test } from "vitest";
import { CalendarDate, CalendarDateTime } from "@internationalized/date";
import { formatDateRangeFilterValue } from "./formatDateRangeFilterValue";

const format = (key: string, { date }: { date: string }) => `${key}(${date})`;

const startDate = new CalendarDate(2026, 10, 1);
const startDateTime = new CalendarDateTime(2026, 10, 1, 22, 0);
const endDateTime = new CalendarDateTime(2026, 10, 2, 6, 0);

describe("formatDateRangeFilterValue", () => {
  test.each([
    ["de-DE", "01.10.2026, 22:00 – 02.10.2026, 06:00"],
    ["en-US", "Oct 1, 2026, 22:00 – Oct 2, 2026, 06:00"],
  ])("formats a range with time in %s", (locale, expected) => {
    expect(
      formatDateRangeFilterValue(
        { start: startDateTime, end: endDateTime },
        locale,
        format,
      ),
    ).toBe(expected);
  });

  test("shows the time only where it is set", () => {
    expect(
      formatDateRangeFilterValue(
        { start: startDate, end: endDateTime },
        "de-DE",
        format,
      ),
    ).toBe("01.10.2026 – 02.10.2026, 06:00");
  });

  test("formats open ranges", () => {
    expect(
      formatDateRangeFilterValue({ start: startDateTime }, "de-DE", format),
    ).toBe("dateRange.from(01.10.2026, 22:00)");
    expect(
      formatDateRangeFilterValue({ end: endDateTime }, "de-DE", format),
    ).toBe("dateRange.until(02.10.2026, 06:00)");
  });
});
