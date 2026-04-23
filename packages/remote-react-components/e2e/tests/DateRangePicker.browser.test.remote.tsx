import { DateRangePicker } from "../../src/auto-generated";
import { CalendarDate } from "@internationalized/date";

export const standard = () => <DateRangePicker data-testid="element" />;

export const withValue = () => (
  <DateRangePicker
    aria-label="test"
    data-testid="element"
    value={{
      start: new CalendarDate(2025, 1, 1),
      end: new CalendarDate(2025, 1, 2),
    }}
  />
);

export const withPresets = () => (
  <DateRangePicker
    aria-label="test"
    data-testid="element"
    value={{
      start: new CalendarDate(2025, 1, 1),
      end: new CalendarDate(2025, 1, 2),
    }}
    withDatePickerPresets
  />
);

export const withCustomPresets = () => (
  <DateRangePicker
    aria-label="test"
    data-testid="element"
    value={{
      start: new CalendarDate(2025, 1, 1),
      end: new CalendarDate(2025, 1, 2),
    }}
    withDatePickerPresets={[
      {
        start: new CalendarDate(2026, 1, 2),
        end: new CalendarDate(2027, 3, 4),
        label: "Custom Preset",
      },
    ]}
  />
);
