import { Label } from "@mittwald/flow-react-components";
import {
  RadioGroup,
  RadioButton,
} from "@mittwald/flow-react-components";

<RadioGroup defaultValue="mysql">
  <Label>Datenbank-Typ</Label>
  <RadioButton value="mysql">MySQL</RadioButton>
  <RadioButton value="redis">Redis</RadioButton>
</RadioGroup>;
