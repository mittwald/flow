import {
  DateRangePicker,
  Label,
} from "@mittwald/flow-react-components";
import {
  getLocalTimeZone,
  today,
} from "@internationalized/date";

<DateRangePicker minValue={today(getLocalTimeZone())}>
  <Label>Zeitraum</Label>
</DateRangePicker>;
