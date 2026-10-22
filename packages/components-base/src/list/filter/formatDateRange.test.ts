import { describe, expect, test } from "vitest";
import { CalendarDate, CalendarDateTime } from "@internationalized/date";
import { formatListDateRange } from "./formatDateRange";

const format = (key: string, { date }: { date: string }) => `${key}(${date})`;

const startDate = new CalendarDate(2026, 10, 1);
const startDateTime = new CalendarDateTime(2026, 10, 1, 22, 0);
const endDateTime = new CalendarDateTime(2026, 10, 2, 6, 0);

describe("formatListDateRange", () => {
  test.each([
    ["de-DE", "1.10.2026, 22:00 – 2.10.2026, 06:00"],
    ["en-US", "10/1/2026, 22:00 – 10/2/2026, 06:00"],
  ])("formats a range with time in %s", (locale, expected) => {
    expect(
      formatListDateRange(
        { start: startDateTime, end: endDateTime },
        locale,
        format,
      ),
    ).toBe(expected);
  });

  test("shows the time only where it is set", () => {
    expect(
      formatListDateRange(
        { start: startDate, end: endDateTime },
        "de-DE",
        format,
      ),
    ).toBe("1.10.2026 – 2.10.2026, 06:00");
  });

  test("formats open ranges", () => {
    expect(formatListDateRange({ start: startDateTime }, "de-DE", format)).toBe(
      "dateRange.from(1.10.2026, 22:00)",
    );
    expect(formatListDateRange({ end: endDateTime }, "de-DE", format)).toBe(
      "dateRange.until(2.10.2026, 06:00)",
    );
  });
});
