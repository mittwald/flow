import { type FC, useId, useState } from "react";
import {
  getListDateTimeRangeUpdate,
  isListDateTimeRangeEndBeforeStart,
  listDateTimeRangeFieldsFromValue,
  toListCalendarDate,
  toListTime,
  type ListDateTimeRangeFields,
} from "@mittwald/flow-components-base";
import clsx from "clsx";
import DatePickerView from "@/views/DatePickerView";
import TimeFieldView from "@/views/TimeFieldView";
import LabelView from "@/views/LabelView";
import FieldErrorView from "@/views/FieldErrorView";
import DivView from "@/views/DivView";
import { useLocalizedStringFormatter } from "@/components/TranslationProvider/useLocalizedStringFormatter";
import locales from "../../../../locales/*.locale.json";
import type { AnyDateRangeFilter } from "@/components/List/model/filter/types";
import styles from "./DateTimeRangeFields.module.scss";

interface Props {
  filter: AnyDateRangeFilter;
  className?: string;
}

export const DateTimeRangeFields: FC<Props> = (props) => {
  const { filter, className } = props;

  const stringFormatter = useLocalizedStringFormatter(locales, "List");

  const value = filter.getValue();
  const [appliedValue, setAppliedValue] = useState(value);
  const [fields, setFields] = useState(() =>
    listDateTimeRangeFieldsFromValue(value),
  );

  if (value !== appliedValue) {
    setAppliedValue(value);
    setFields(listDateTimeRangeFieldsFromValue(value));
  }

  const options = filter.dateTimeRangeOptions;
  const minValue = toListCalendarDate(options?.minValue);
  const maxValue = toListCalendarDate(options?.maxValue);

  const update = (change: Partial<ListDateTimeRangeFields>) => {
    const next = { ...fields, ...change };
    setFields(next);

    const newValue = getListDateTimeRangeUpdate(next, appliedValue, options);
    if (newValue === undefined) {
      return;
    }

    setAppliedValue(newValue);

    if (newValue) {
      filter.setValue(newValue);
    } else {
      filter.clear();
    }
  };

  const rangeErrorId = useId();
  const hasRangeError = isListDateTimeRangeEndBeforeStart(fields);
  const describedBy = hasRangeError ? rangeErrorId : undefined;

  return (
    <DivView className={clsx(styles.dateTimeRangeFields, className)}>
      <DatePickerView
        value={fields.startDate}
        onChange={(date) => update({ startDate: toListCalendarDate(date) })}
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
        onChange={(time) => update({ startTime: toListTime(time) })}
        aria-describedby={describedBy}
      >
        <LabelView optional={false}>
          {stringFormatter.format("dateRange.startTime")}
        </LabelView>
      </TimeFieldView>
      <DatePickerView
        value={fields.endDate}
        onChange={(date) => update({ endDate: toListCalendarDate(date) })}
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
        onChange={(time) => update({ endTime: toListTime(time) })}
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
