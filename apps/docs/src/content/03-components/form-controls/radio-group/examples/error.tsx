import {
  RadioButton,
  RadioGroup,
} from "@mittwald/flow-react-components/RadioGroup";
import Label from "@mittwald/flow-react-components/Label";
import { FieldError } from "@mittwald/flow-react-components/FieldError";

<RadioGroup isInvalid>
  <Label>Datenbank-Typ</Label>
  <RadioButton value="mysql">MySQL</RadioButton>
  <RadioButton value="redis">Redis</RadioButton>
  <FieldError>Bitte wähle eine Option aus</FieldError>
</RadioGroup>;
