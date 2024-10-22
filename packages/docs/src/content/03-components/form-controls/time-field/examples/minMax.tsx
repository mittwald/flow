import Label from "@mittwald/flow-react-components/Label";
import { Time } from "@internationalized/date";
import { TimeField } from "@mittwald/flow-react-components/TimeField";
import { FieldDescription } from "@mittwald/flow-react-components/FieldDescription";

<TimeField
  minValue={new Time(8, 0)}
  maxValue={new Time(16, 0)}
>
  <Label>Uhrzeit</Label>
  <FieldDescription>Zwischen 8 und 16 Uhr</FieldDescription>
</TimeField>;
