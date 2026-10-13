import {
  DatePicker,
  Div,
  FieldError,
  Label,
  TimeField,
} from "@/auto-generated";
import { watchMobxValue } from "@/lib/mobxSelector";
import {
  getListDateTimeRangeUpdate,
  isListDateTimeRangeEndBeforeStart,
  listDateTimeRangeFieldsFromValue,
  toListCalendarDate,
  toListTime,
  type ListDateRange,
  type ListDateTimeRangeFields,
  type ListDateTimeRangeLimits,
} from "@mittwald/flow-components-base";
import {
  defineComponent,
  h,
  shallowRef,
  useId,
  watch,
  type PropType,
} from "vue";
import { composition } from "@/lib/composition";
import { injectListModel } from "./listContext";
import { useListTexts, type ListTextKey } from "./locales";
import { className, dateTimeRangeStyles } from "./styles";

/** What the fields need of a date-range filter, and nothing more. */
export interface DateTimeRangeFilter {
  readonly dateTimeRangeLimits?: ListDateTimeRangeLimits;
  getValue(): ListDateRange | null;
  setValue(range: ListDateRange): void;
  clear(): void;
}

/**
 * Flow's `DateTimeRangeFields`: start and end, each a date and a time, for a
 * filter with `granularity: "minute"`.
 *
 * Which input is valid and when it applies is `components-base`'s
 * (`getListDateTimeRangeUpdate`), so both bindings apply the same ranges. What
 * is held here is the input itself, which may be invalid for a while — a year
 * typed digit by digit, an end before its start — while the filter keeps the
 * last valid range.
 */
export const DateTimeRangeFields = defineComponent({
  name: "ListDateTimeRangeFields",

  props: {
    filter: {
      type: Object as PropType<DateTimeRangeFilter>,
      required: true,
    },
    class: { type: String, default: undefined },
  },

  setup(props) {
    const list = injectListModel();
    const texts = useListTexts();
    const rangeErrorId = useId();

    /* The filter's value is table state, read through the table's revision. */
    const tableRevision = watchMobxValue(() => list.listTable.revision);

    let appliedValue = props.filter.getValue();
    const fields = shallowRef(listDateTimeRangeFieldsFromValue(appliedValue));

    /* A range set elsewhere — the chip, "Reset filters" — replaces the input. */
    watch(tableRevision, () => {
      const value = props.filter.getValue();
      if (value !== appliedValue) {
        appliedValue = value;
        fields.value = listDateTimeRangeFieldsFromValue(value);
      }
    });

    const update = (change: Partial<ListDateTimeRangeFields>) => {
      const next = { ...fields.value, ...change };
      fields.value = next;

      const newValue = getListDateTimeRangeUpdate(
        next,
        appliedValue,
        props.filter.dateTimeRangeLimits,
      );
      if (newValue === undefined) {
        return;
      }

      appliedValue = newValue;

      if (newValue) {
        props.filter.setValue(newValue);
      } else {
        props.filter.clear();
      }
    };

    const label = (key: ListTextKey) => () =>
      h(Label, { optional: false }, () => texts.value(key));

    return () => {
      const limits = props.filter.dateTimeRangeLimits;
      const minValue = toListCalendarDate(limits?.minValue);
      const maxValue = toListCalendarDate(limits?.maxValue);
      const hasRangeError = isListDateTimeRangeEndBeforeStart(fields.value);
      const describedBy = hasRangeError ? rangeErrorId : undefined;

      const datePicker = (
        side: "startDate" | "endDate",
        labelKey: ListTextKey,
      ) =>
        h(
          DatePicker,
          {
            value: fields.value[side],
            onChange: (date: Parameters<typeof toListCalendarDate>[0]) =>
              update({ [side]: toListCalendarDate(date) }),
            minValue,
            maxValue,
            "aria-describedby": describedBy,
            isDateUnavailable: limits?.isDateUnavailable,
          } as never,
          () => [label(labelKey)(), h(FieldError)],
        );

      const timeField = (
        side: "startTime" | "endTime",
        labelKey: ListTextKey,
      ) =>
        h(
          TimeField,
          {
            value: fields.value[side],
            onChange: (time: Parameters<typeof toListTime>[0]) =>
              update({ [side]: toListTime(time) }),
            "aria-describedby": describedBy,
          } as never,
          label(labelKey),
        );

      return h(
        Div,
        { class: className(dateTimeRangeStyles.fields, props.class) },
        () => [
          datePicker("startDate", "dateRange.startDate"),
          timeField("startTime", "dateRange.startTime"),
          datePicker("endDate", "dateRange.endDate"),
          timeField("endTime", "dateRange.endTime"),
          hasRangeError
            ? h(
                FieldError,
                { id: rangeErrorId, class: dateTimeRangeStyles.rangeError },
                () => texts.value("dateRange.endBeforeStart"),
              )
            : null,
        ],
      );
    };
  },
});

composition(DateTimeRangeFields);

export default DateTimeRangeFields;
