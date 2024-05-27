import Label from "@mittwald/flow-react-components/Label";
import Slider from "@mittwald/flow-react-components/Slider";

<Slider
  formatOptions={{
    style: "unit",
    unit: "gigabyte",
  }}
  minValue={20}
  maxValue={2000}
  defaultValue={200}
  step={20}
>
  <Label>Storage</Label>
</Slider>;
