import Label from "@mittwald/flow-react-components/Label";
import RadioGroup, {
  RadioButton,
} from "@mittwald/flow-react-components/RadioGroup";

<RadioGroup
  defaultValue="one"
  s={[1, 1]}
  m={[1, 1, 1]}
  l={[1, 1, 1, 1]}
>
  <Label>Benutzerdefinierte Spalten</Label>
  <RadioButton value="one">Spalte 1</RadioButton>
  <RadioButton value="two">Spalte 2</RadioButton>
  <RadioButton value="three">Spalte 3</RadioButton>
</RadioGroup>;
