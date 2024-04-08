import NumberField from "@mittwald/flow-react-components/NumberField";
import Label from "@mittwald/flow-react-components/Label";
import FieldError from "@mittwald/flow-react-components/FieldError";

<NumberField isInvalid value={-1}>
  <Label>Age</Label>
  <FieldError>Invalid input</FieldError>
</NumberField>;
