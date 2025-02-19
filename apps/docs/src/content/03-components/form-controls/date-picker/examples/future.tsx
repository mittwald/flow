import {
  DatePicker,
  Label,
} from "@mittwald/flow-react-components";
import {
  getLocalTimeZone,
  today,
} from "@internationalized/date";

<DatePicker minValue={today(getLocalTimeZone())}>
  <Label>Datum</Label>
</DatePicker>;
