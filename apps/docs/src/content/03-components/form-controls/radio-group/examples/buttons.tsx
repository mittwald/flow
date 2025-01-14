import Label from "@mittwald/flow-react-components/Label";
import RadioGroup, {
  RadioButton,
} from "@mittwald/flow-react-components/RadioGroup";

<RadioGroup defaultValue="mysql">
  <Label>Datenbank-Typ</Label>
  <RadioButton value="mysql">MySQL</RadioButton>
  <RadioButton value="redis">Redis</RadioButton>
</RadioGroup>;
