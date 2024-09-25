import Label from "@mittwald/flow-react-components/Label";
import RadioGroup, {
  Radio,
} from "@mittwald/flow-react-components/RadioGroup";

<RadioGroup defaultValue="admin">
  <Label>Rolle</Label>
  <Radio value="admin">Administrator</Radio>
  <Radio value="member">Mitglied</Radio>
  <Radio value="accountant">Buchhalter</Radio>
</RadioGroup>;
