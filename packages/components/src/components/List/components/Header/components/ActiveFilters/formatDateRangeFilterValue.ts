import { DateFormatter, type DateValue } from "@internationalized/date";
import type { DateRangeFilterValue } from "@/components/List/model/filter/types";
import { dateValueToLocalDateTime } from "@/components/List/model/filter/resolveDateRangeFilterValue";

type Format = (key: string, variables: { date: string }) => string;

export const formatDateRangeFilterValue = (
  value: DateRangeFilterValue,
  locale: string,
  format: Format,
): string => {
  const formatBound = (bound: DateValue) =>
    new DateFormatter(locale, {
      dateStyle: "medium",
      // TimeField always shows 24 hours
      ...("hour" in bound ? { timeStyle: "short", hourCycle: "h23" } : {}),
    }).format(dateValueToLocalDateTime(bound).toJSDate());

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
