import { DateTime } from "luxon";
import { CalendarDate } from "@internationalized/date";
import { useContext, useMemo } from "react";
import { RangeCalendarStateContext } from "react-aria-components";
import { useLocalizedStringFormatter } from "@/components/TranslationProvider";
import locales from "../../../locales/*.locale.json";

export interface DateRangePresetItem {
  start: CalendarDate;
  end: CalendarDate;
  label: string;
}

export type DateRangePresets = DateRangePresetItem[];

interface CalendarDateRangePresetItem extends DateRangePresetItem {
  onPress: () => void;
  disabled: boolean;
}

/** @internal * */
export const useCalendarDateRangePresets = (
  customPresets?: DateRangePresets | boolean,
): CalendarDateRangePresetItem[] => {
  const now = DateTime.local();
  const state = useContext(RangeCalendarStateContext);
  const stringFormatter = useLocalizedStringFormatter(locales, "Calendar");

  const isValidRange = (range: { start: CalendarDate; end: CalendarDate }) => {
    return (
      !!state && !state.isInvalid(range.start) && !state.isInvalid(range.end)
    );
  };

  const possibleRanges = useMemo<DateRangePresets>(() => {
    if (typeof customPresets !== "boolean") {
      return customPresets ?? [];
    }

    const todayDate = new CalendarDate(now.year, now.month, now.day);
    const yesterdayLuxon = now.minus({ days: 1 });
    const yesterdayDate = new CalendarDate(
      yesterdayLuxon.year,
      yesterdayLuxon.month,
      yesterdayLuxon.day,
    );

    const thisWeekStart = now.startOf("week");
    const thisWeekEnd = now.endOf("week");
    const lastWeekLuxon = now.minus({ week: 1 });
    const lastWeekStart = lastWeekLuxon.startOf("week");
    const lastWeekEnd = lastWeekLuxon.endOf("week");

    const thisMonthStart = now.startOf("month");
    const thisMonthEnd = now.endOf("month");
    const lastMonthLuxon = now.minus({ month: 1 });
    const lastMonthStart = lastMonthLuxon.startOf("month");
    const lastMonthEnd = lastMonthLuxon.endOf("month");

    const thisYearStart = now.startOf("year");
    const thisYearEnd = now.endOf("year");
    const lastYearLuxon = now.minus({ year: 1 });
    const lastYearStart = lastYearLuxon.startOf("year");
    const lastYearEnd = lastYearLuxon.endOf("year");

    return [
      {
        label: stringFormatter.format("preset.today"),
        start: todayDate,
        end: todayDate,
      },
      {
        label: stringFormatter.format("preset.yesterday"),
        start: yesterdayDate,
        end: yesterdayDate,
      },
      {
        label: stringFormatter.format("preset.thisWeek"),
        start: new CalendarDate(
          thisWeekStart.year,
          thisWeekStart.month,
          thisWeekStart.day,
        ),
        end: new CalendarDate(
          thisWeekEnd.year,
          thisWeekEnd.month,
          thisWeekEnd.day,
        ),
      },
      {
        label: stringFormatter.format("preset.lastWeek"),
        start: new CalendarDate(
          lastWeekStart.year,
          lastWeekStart.month,
          lastWeekStart.day,
        ),
        end: new CalendarDate(
          lastWeekEnd.year,
          lastWeekEnd.month,
          lastWeekEnd.day,
        ),
      },
      {
        label: stringFormatter.format("preset.thisMonth"),
        start: new CalendarDate(
          thisMonthStart.year,
          thisMonthStart.month,
          thisMonthStart.day,
        ),
        end: new CalendarDate(
          thisMonthEnd.year,
          thisMonthEnd.month,
          thisMonthEnd.day,
        ),
      },
      {
        label: stringFormatter.format("preset.lastMonth"),
        start: new CalendarDate(
          lastMonthStart.year,
          lastMonthStart.month,
          lastMonthStart.day,
        ),
        end: new CalendarDate(
          lastMonthEnd.year,
          lastMonthEnd.month,
          lastMonthEnd.day,
        ),
      },
      {
        label: stringFormatter.format("preset.thisYear"),
        start: new CalendarDate(
          thisYearStart.year,
          thisYearStart.month,
          thisYearStart.day,
        ),
        end: new CalendarDate(
          thisYearEnd.year,
          thisYearEnd.month,
          thisYearEnd.day,
        ),
      },
      {
        label: stringFormatter.format("preset.lastYear"),
        start: new CalendarDate(
          lastYearStart.year,
          lastYearStart.month,
          lastYearStart.day,
        ),
        end: new CalendarDate(
          lastYearEnd.year,
          lastYearEnd.month,
          lastYearEnd.day,
        ),
      },
    ];
  }, [now, customPresets]);

  return possibleRanges.map((range) => ({
    ...range,
    disabled: !isValidRange(range),
    onPress: () => {
      if (state) {
        state.setValue({ start: range.start, end: range.end });
      }
    },
  }));
};
