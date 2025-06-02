import { DateRangePicker } from "@/auto-generated";
import { CalendarDate } from "@internationalized/date";

export const standard = () => <DateRangePicker data-testid="element" />;

export const withValue = () => (
  <DateRangePicker
    data-testid="element"
    value={{
      start: new CalendarDate(2025, 1, 1),
      end: new CalendarDate(2025, 1, 2),
    }}
  />
);
