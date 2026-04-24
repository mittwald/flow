import {
  DateRangePicker,
  Label,
  Section,
} from "@mittwald/flow-react-components";

export default () => {
  return (
    <Section>
      <DateRangePicker withDatePickerPresets>
        <Label>Zeitraum</Label>
      </DateRangePicker>
    </Section>
  );
};
