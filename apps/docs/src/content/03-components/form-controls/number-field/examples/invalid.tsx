import { NumberField } from "@mittwald/flow-react-components";
import { Label } from "@mittwald/flow-react-components";
import { FieldError } from "@mittwald/flow-react-components";

<NumberField isInvalid value={-1}>
  <Label>Alter</Label>
  <FieldError>Ungültige Eingabe</FieldError>
</NumberField>;
