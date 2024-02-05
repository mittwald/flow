import Label from "@mittwald/flow-next-components/Label";
import RadioGroup, { Radio } from "@mittwald/flow-next-components/RadioGroup";

<RadioGroup defaultValue="admin">
  <Label>Role</Label>
  <Radio value="admin">Admin</Radio>
  <Radio value="member">Member</Radio>
  <Radio value="accountant">Accountant</Radio>
</RadioGroup>;
