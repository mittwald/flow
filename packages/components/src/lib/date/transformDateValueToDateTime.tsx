import type { DateValue } from "@internationalized/date";
import { DateTime } from "luxon";

export const transformDateValueToDateTime = (date: DateValue) => {
  return DateTime.fromObject({
    year: date.year,
    month: date.month,
    day: date.day,
  });
};
