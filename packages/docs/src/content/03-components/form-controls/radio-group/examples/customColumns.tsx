import Label from "@mittwald/flow-react-components/Label";
import RadioGroup, {
  RadioButton,
} from "@mittwald/flow-react-components/RadioGroup";

<RadioGroup
  defaultValue="admin"
  s={[1, 1]}
  m={[1, 1, 1]}
  l={[1, 1, 1, 1]}
>
  <Label>Rolle</Label>
  <RadioButton value="admin">Administrator</RadioButton>
  <RadioButton value="member">Mitglied</RadioButton>
  <RadioButton value="accountant">Buchhalter</RadioButton>
</RadioGroup>;
