import {
  Label,
  Slider,
} from "@mittwald/flow-react-components";

<Slider
  formatOptions={{
    style: "unit",
    unit: "gigabyte",
  }}
  minValue={50}
  maxValue={750}
  defaultValue={150}
  step={50}
  showInitialMarker
>
  <Label>Speicherplatz</Label>
</Slider>;
