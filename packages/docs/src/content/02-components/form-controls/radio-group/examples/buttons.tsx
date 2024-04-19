import Label from "@mittwald/flow-react-components/Label";
import RadioGroup, {
  RadioButton,
} from "@mittwald/flow-react-components/RadioGroup";

<RadioGroup defaultValue="admin">
  <Label>Rolle</Label>
  <RadioButton value="admin">Administrator</RadioButton>
  <RadioButton value="member">Mitglied</RadioButton>
  <RadioButton value="accountant">Buchhalter</RadioButton>
</RadioGroup>;
