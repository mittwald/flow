import {
  DatePicker,
  FieldDescription,
  Label,
} from "@mittwald/flow-react-components";
import { type DateValue } from "@internationalized/date";

<DatePicker
  isRequired
  isDateUnavailable={(date: DateValue) => date.day !== 1}
>
  <Label>Datum</Label>
  <FieldDescription>
    Es kann nur der 1. jeden Monats ausgewählt werden
  </FieldDescription>
</DatePicker>;
