import type { DateValue } from "@internationalized/date";
import { DateTime } from "luxon";
import type { DateRangeFilterValue } from "@/components/List/model/filter/types";

const hasTime = (value: DateValue) => "hour" in value;

export const dateValueToLocalDateTime = (value: DateValue): DateTime =>
  "timeZone" in value
    ? DateTime.fromJSDate(value.toDate())
    : DateTime.fromObject({
        year: value.year,
        month: value.month,
        day: value.day,
        ...(hasTime(value)
          ? { hour: value.hour, minute: value.minute, second: value.second }
          : {}),
      });

/**
 * Resolves the value of a date range filter to the instants it spans, for
 * filtering on the server side. Both bounds are inclusive: a date covers its
 * whole day and a date with time its whole minute, in the user's local time
 * zone. A missing side has no bound.
 */
export const resolveDateRangeFilterValue = (
  range: DateRangeFilterValue,
): { start?: Date; end?: Date } => {
  const unit = (value: DateValue) => (hasTime(value) ? "minute" : "day");

  return {
    start: range.start
      ? dateValueToLocalDateTime(range.start)
          .startOf(unit(range.start))
          .toJSDate()
      : undefined,
    end: range.end
      ? dateValueToLocalDateTime(range.end).endOf(unit(range.end)).toJSDate()
      : undefined,
  };
};
