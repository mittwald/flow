import type { DateValue } from "@internationalized/date";

export const transformDateValueToFormattedDate = (date: DateValue) => {
  return new Date(date.year, date.month - 1, date.day).toLocaleDateString();
};
