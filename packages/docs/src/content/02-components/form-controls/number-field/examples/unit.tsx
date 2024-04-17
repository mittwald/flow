import { NumberField } from "@mittwald/flow-react-components/NumberField";
import { Label } from "@mittwald/flow-react-components/Label";

<NumberField
  formatOptions={{
    style: "unit",
    unit: "gigabyte",
  }}
  defaultValue={12}
>
  <Label>Speicherplatz</Label>
</NumberField>;
