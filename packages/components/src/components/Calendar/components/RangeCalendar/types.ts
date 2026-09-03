import type { DateRange } from "react-aria-components";

export type {
  DateRangePresets,
  DateRangePresetItem,
} from "./helpers/useCalendarDateRangePresets";

export function isDateRangeValue(value: unknown): value is DateRange {
  return !!(
    value &&
    typeof value === "object" &&
    "start" in value &&
    "end" in value
  );
}
