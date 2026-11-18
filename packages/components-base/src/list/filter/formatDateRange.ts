import { DateFormatter } from "@internationalized/date";
import {
  listDateToDateTime,
  type ListDateParts,
  type ListDateRange,
} from "./dateRange";

/** Formats the text of an open range ("from {date}", "until {date}"). */
export type ListDateRangeTextFormat = (
  key: "dateRange.from" | "dateRange.until",
  values: { date: string },
) => string;

/** The active filter chip's text: an end with time shows its time. */
export const formatListDateRange = (
  value: ListDateRange,
  locale: string,
  format: ListDateRangeTextFormat,
): string => {
  const formatBound = (bound: ListDateParts) =>
    new DateFormatter(locale, {
      year: "numeric",
      month: "numeric",
      day: "numeric",
      // TimeField always shows 24 hours
      ...("hour" in bound
        ? { hour: "2-digit", minute: "2-digit", hourCycle: "h23" }
        : {}),
    }).format(listDateToDateTime(bound).toJSDate());

  const { start, end } = value;

  if (start && end) {
    return `${formatBound(start)} – ${formatBound(end)}`;
  }
  if (start) {
    return format("dateRange.from", { date: formatBound(start) });
  }
  if (end) {
    return format("dateRange.until", { date: formatBound(end) });
  }
  return "";
};
