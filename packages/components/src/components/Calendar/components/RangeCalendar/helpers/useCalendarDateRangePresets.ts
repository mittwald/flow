import { DateTime } from "luxon";
import { CalendarDate, toCalendarDate } from "@internationalized/date";
import { useContext, useMemo } from "react";
import { RangeCalendarStateContext } from "react-aria-components";
import { useLocalizedStringFormatter } from "@/components/TranslationProvider";
import locales from "../../../locales/*.locale.json";
import invariant from "invariant";

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

const clampCalendarDate = (
  date: CalendarDate,
  minDate?: CalendarDate,
  maxDate?: CalendarDate,
) => {
  if (minDate && date.compare(minDate) < 0) {
    return minDate;
  }

  if (maxDate && date.compare(maxDate) > 0) {
    return maxDate;
  }

  return date;
};

const clampCalendarDateRange = (
  startDate: CalendarDate,
  endDate: CalendarDate,
  minDate?: CalendarDate,
  maxDate?: CalendarDate,
) => {
  const clampedStart = clampCalendarDate(startDate, minDate, maxDate);
  const clampedEnd = clampCalendarDate(endDate, minDate, maxDate);

  return {
    start: clampedStart,
    end: clampedEnd,
    invalid: clampedStart.compare(clampedEnd) > 0,
  };
};

/** @internal * */
export const useCalendarDateRangePresets = (
  customPresets?: DateRangePresets | boolean,
): CalendarDateRangePresetItem[] => {
  const now = DateTime.local();
  const state = useContext(RangeCalendarStateContext);
  const stringFormatter = useLocalizedStringFormatter(locales, "Calendar");

  invariant(!!state, "Could not find RangeCalendarStateContext.");

  const minDate = state.minValue ? toCalendarDate(state.minValue) : undefined;
  const maxDate = state.maxValue ? toCalendarDate(state.maxValue) : undefined;

  const isValidRange = (range: { start: CalendarDate; end: CalendarDate }) =>
    !state.isInvalid(range.start) && !state.isInvalid(range.end);

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
  }, [now, customPresets, stringFormatter]);

  return possibleRanges.map((range) => {
    if (
      (minDate && range.end.compare(minDate) < 0) ||
      (maxDate && range.start.compare(maxDate) > 0)
    ) {
      return {
        ...range,
        disabled: true,
        onPress: () => {
          // void
        },
      };
    }

    const { start, end, invalid } = clampCalendarDateRange(
      range.start,
      range.end,
      minDate,
      maxDate,
    );

    const presetDisabled = invalid || !isValidRange({ start, end });

    return {
      ...range,
      start,
      end,
      disabled: presetDisabled,
      onPress: () => {
        if (!presetDisabled) {
          state.setValue({ start, end });
        }
      },
    };
  });
};
