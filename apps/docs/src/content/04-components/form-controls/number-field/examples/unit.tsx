import {
  Label,
  NumberField,
} from "@mittwald/flow-react-components";

<NumberField
  formatOptions={{
    style: "unit",
    unit: "gigabyte",
  }}
  defaultValue={12}
>
  <Label>Speicherplatz</Label>
</NumberField>;
