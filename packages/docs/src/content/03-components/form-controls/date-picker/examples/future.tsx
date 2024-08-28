import DatePicker from "@mittwald/flow-react-components/DatePicker";
import Label from "@mittwald/flow-react-components/Label";
import {
  getLocalTimeZone,
  today,
} from "@internationalized/date";

<DatePicker minValue={today(getLocalTimeZone())}>
  <Label>Datum</Label>
</DatePicker>;
