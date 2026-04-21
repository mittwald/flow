import type { DateRangePresets } from "@mittwald/flow-react-components";
import {
  DateRangePicker,
  Label,
  Section,
} from "@mittwald/flow-react-components";
import { CalendarDate } from "@internationalized/date";

export default () => {
  const customPresets: DateRangePresets = [
    {
      start: new CalendarDate(2050, 1, 1),
      end: new CalendarDate(2100, 1, 1),
      label: "Custom Preset",
    },
  ];

  return (
    <Section>
      <DateRangePicker
        withDatePickerPresets={customPresets}
      >
        <Label>Zeitraum</Label>
      </DateRangePicker>
    </Section>
  );
};
