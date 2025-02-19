import {
  Label,
  ProgressBar,
} from "@mittwald/flow-react-components";

<ProgressBar
  value={500}
  maxValue={1000}
  minValue={0}
  formatOptions={{ style: "unit", unit: "gigabyte" }}
>
  <Label>Speicher</Label>
</ProgressBar>;
