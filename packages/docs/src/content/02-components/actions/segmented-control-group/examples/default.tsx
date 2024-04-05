import SegmentedControlGroup from "@mittwald/flow-react-components/SegmentedControlGroup";
import Radio from "@mittwald/flow-react-components/RadioGroup";

<SegmentedControlGroup
  defaultValue="admin"
  aria-label="Role"
>
  <Radio value="admin">Admin</Radio>
  <Radio value="member">Member</Radio>
  <Radio value="accountant">Accountant</Radio>
</SegmentedControlGroup>;
