import { Label } from "@mittwald/flow-react-components";
import { Slider } from "@mittwald/flow-react-components";

<Slider
  formatOptions={{
    style: "unit",
    unit: "gigabyte",
  }}
  minValue={20}
  maxValue={2000}
  defaultValue={200}
  step={20}
  showInitialMarker
>
  <Label>Storage</Label>
</Slider>;
