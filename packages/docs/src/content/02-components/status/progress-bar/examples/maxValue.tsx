import ProgressBar from "@mittwald/flow-react-components/ProgressBar";
import Label from "@mittwald/flow-react-components/Label";

<ProgressBar
  showMaxValue
  value={500}
  maxValue={1000}
  minValue={0}
  formatOptions={{ style: "unit", unit: "gigabyte" }}
>
  <Label>Speicher</Label>
</ProgressBar>;
