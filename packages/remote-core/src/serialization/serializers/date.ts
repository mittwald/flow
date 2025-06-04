import { CalendarDate } from "@internationalized/date";
import { parseDate } from "@internationalized/date";
import { Serializer } from "@/serialization/Serializer";

export const calendarDateSerializer = new Serializer<CalendarDate, string>({
  name: "CalendarDate",
  serialize: {
    isApplicable: (val) => val instanceof CalendarDate,
    apply: (date) => date.toString(),
  },
  deserialize: {
    apply: (asString) => parseDate(asString),
  },
});
