import {
  Label,
  TimeField,
} from "@mittwald/flow-react-components";

<Row>
  <TimeField granularity="hour">
    <Label>Stunde</Label>
  </TimeField>
  <TimeField>
    <Label>Stunde und Minute</Label>
  </TimeField>
  <TimeField granularity="second">
    <Label>Stunde, Minute und Sekunde</Label>
  </TimeField>
</Row>;
