import {
  FieldDescription,
  Label,
  TimeField,
} from "@mittwald/flow-react-components";
import { Time } from "@internationalized/date";

<TimeField
  minValue={new Time(8, 0)}
  maxValue={new Time(16, 0)}
>
  <Label>Uhrzeit</Label>
  <FieldDescription>Zwischen 8 und 16 Uhr</FieldDescription>
</TimeField>;
