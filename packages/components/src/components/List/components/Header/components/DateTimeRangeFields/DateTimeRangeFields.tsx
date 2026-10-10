import { type FC, useId, useState } from "react";
import {
  type CalendarDate,
  type DateValue,
  Time,
  toCalendarDate,
  toCalendarDateTime,
} from "@internationalized/date";
import type { TimeValue } from "react-aria-components";
import clsx from "clsx";
import DatePickerView from "@/views/DatePickerView";
import TimeFieldView from "@/views/TimeFieldView";
import LabelView from "@/views/LabelView";
import FieldErrorView from "@/views/FieldErrorView";
import DivView from "@/views/DivView";
import { useLocalizedStringFormatter } from "@/components/TranslationProvider/useLocalizedStringFormatter";
import locales from "../../../../locales/*.locale.json";
import type {
  AnyDateRangeFilter,
  DateRangeFilterValue,
} from "@/components/List/model/filter/types";
import { resolveDateRangeFilterValue } from "@/components/List/model/filter/resolveDateRangeFilterValue";
import styles from "./DateTimeRangeFields.module.scss";

interface Props {
  filter: AnyDateRangeFilter;
  className?: string;
}

interface Fields {
  startDate: CalendarDate | null;
  startTime: Time | null;
  endDate: CalendarDate | null;
  endTime: Time | null;
}

const toDate = (value?: DateValue | null) =>
  value ? toCalendarDate(value) : null;

/** A time from the host of a remote connection arrives as a plain object. */
const toTime = (value?: TimeValue | DateValue | null) =>
  value && "hour" in value ? new Time(value.hour, value.minute) : null;

const fieldsFromValue = (value: DateRangeFilterValue | null): Fields => ({
  startDate: toDate(value?.start),
  startTime: toTime(value?.start),
  endDate: toDate(value?.end),
  endTime: toTime(value?.end),
});

const toBound = (date: CalendarDate | null, time: Time | null) =>
  date ? (time ? toCalendarDateTime(date, time) : date) : undefined;

const isSameBound = (a?: DateValue, b?: DateValue) =>
  a?.toString() === b?.toString();

const isEndBeforeStart = (fields: Fields) => {
  const { start, end } = resolveDateRangeFilterValue({
    start: toBound(fields.startDate, fields.startTime),
    end: toBound(fields.endDate, fields.endTime),
  });
  return !!start && !!end && end < start;
};

export const DateTimeRangeFields: FC<Props> = (props) => {
  const { filter, className } = props;

  const stringFormatter = useLocalizedStringFormatter(locales, "List");

  const value = filter.getValue();
  const [appliedValue, setAppliedValue] = useState(value);
  const [fields, setFields] = useState(() => fieldsFromValue(value));

  if (value !== appliedValue) {
    setAppliedValue(value);
    setFields(fieldsFromValue(value));
  }

  const options = filter.dateTimeRangeOptions;
  const minValue = toDate(options?.minValue);
  const maxValue = toDate(options?.maxValue);

  // react-aria reports a typed year digit by digit (2, 20, 202, 2026)
  const isDateValid = (date: CalendarDate | null) =>
    !date ||
    !(
      date.year < 1000 ||
      (minValue && date.compare(minValue) < 0) ||
      (maxValue && date.compare(maxValue) > 0) ||
      options?.isDateUnavailable?.(date)
    );

  const update = (change: Partial<Fields>) => {
    const next = { ...fields, ...change };
    setFields(next);

    // An invalid range keeps the last valid one applied
    if (
      !isDateValid(next.startDate) ||
      !isDateValid(next.endDate) ||
      isEndBeforeStart(next)
    ) {
      return;
    }

    const start = toBound(next.startDate, next.startTime);
    const end = toBound(next.endDate, next.endTime);

    if (
      isSameBound(start, appliedValue?.start) &&
      isSameBound(end, appliedValue?.end)
    ) {
      return;
    }

    const newValue = start || end ? { start, end } : null;
    setAppliedValue(newValue);

    if (newValue) {
      filter.setValue(newValue);
    } else {
      filter.clear();
    }
  };

  const rangeErrorId = useId();
  const hasRangeError = isEndBeforeStart(fields);
  const describedBy = hasRangeError ? rangeErrorId : undefined;

  return (
    <DivView className={clsx(styles.dateTimeRangeFields, className)}>
      <DatePickerView
        value={fields.startDate}
        onChange={(date) => update({ startDate: toDate(date) })}
        minValue={minValue}
        maxValue={maxValue}
        aria-describedby={describedBy}
        isDateUnavailable={options?.isDateUnavailable}
      >
        <LabelView optional={false}>
          {stringFormatter.format("dateRange.startDate")}
        </LabelView>
        <FieldErrorView />
      </DatePickerView>
      <TimeFieldView
        value={fields.startTime}
        onChange={(time) => update({ startTime: toTime(time) })}
        aria-describedby={describedBy}
      >
        <LabelView optional={false}>
          {stringFormatter.format("dateRange.startTime")}
        </LabelView>
      </TimeFieldView>
      <DatePickerView
        value={fields.endDate}
        onChange={(date) => update({ endDate: toDate(date) })}
        minValue={minValue}
        maxValue={maxValue}
        aria-describedby={describedBy}
        isDateUnavailable={options?.isDateUnavailable}
      >
        <LabelView optional={false}>
          {stringFormatter.format("dateRange.endDate")}
        </LabelView>
        <FieldErrorView />
      </DatePickerView>
      <TimeFieldView
        value={fields.endTime}
        onChange={(time) => update({ endTime: toTime(time) })}
        aria-describedby={describedBy}
      >
        <LabelView optional={false}>
          {stringFormatter.format("dateRange.endTime")}
        </LabelView>
      </TimeFieldView>
      {hasRangeError && (
        <FieldErrorView id={rangeErrorId} className={styles.rangeError}>
          {stringFormatter.format("dateRange.endBeforeStart")}
        </FieldErrorView>
      )}
    </DivView>
  );
};

export default DateTimeRangeFields;
