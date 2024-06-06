import DateRangePicker from "@mittwald/flow-react-components/DateRangePicker";
import Label from "@mittwald/flow-react-components/Label";
import {
  getLocalTimeZone,
  today,
} from "@internationalized/date";

<DateRangePicker minValue={today(getLocalTimeZone())}>
  <Label>Zeitraum</Label>
</DateRangePicker>;
