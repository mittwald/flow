import {
  FieldError,
  Label,
  NumberField,
} from "@mittwald/flow-react-components";

<NumberField isInvalid value={-1}>
  <Label>Alter</Label>
  <FieldError>Ungültige Eingabe</FieldError>
</NumberField>;
