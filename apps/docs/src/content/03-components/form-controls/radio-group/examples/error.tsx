import {
  RadioButton,
  RadioGroup,
} from "@mittwald/flow-react-components";
import { Label } from "@mittwald/flow-react-components";
import { FieldError } from "@mittwald/flow-react-components";

<RadioGroup isInvalid>
  <Label>Datenbank-Typ</Label>
  <RadioButton value="mysql">MySQL</RadioButton>
  <RadioButton value="redis">Redis</RadioButton>
  <FieldError>Bitte wähle eine Option aus</FieldError>
</RadioGroup>;
