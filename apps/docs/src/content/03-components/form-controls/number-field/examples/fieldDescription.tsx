import {
  FieldDescription,
  Label,
  NumberField,
} from "@mittwald/flow-react-components";

<NumberField minValue={18} maxValue={100}>
  <Label>Alter</Label>
  <FieldDescription>
    Du musst mindestens 18 Jahre alt sein
  </FieldDescription>
</NumberField>;
