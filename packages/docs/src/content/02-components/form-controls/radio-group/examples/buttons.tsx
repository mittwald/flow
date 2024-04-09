import Label from "@mittwald/flow-react-components/Label";
import RadioGroup, {
  RadioButton,
} from "@mittwald/flow-react-components/RadioGroup";

<RadioGroup defaultValue="admin">
  <Label>Role</Label>
  <RadioButton value="admin">Admin</RadioButton>
  <RadioButton value="member">Member</RadioButton>
  <RadioButton value="accountant">Accountant</RadioButton>
</RadioGroup>;
