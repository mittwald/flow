import Label from "@mittwald/flow-react-components/Label";
import SegmentedButton, {
  Segment,
} from "@mittwald/flow-react-components/SegmentedButton";

<SegmentedButton defaultValue="admin">
  <Label>Role</Label>
  <Segment value="admin">Admin</Segment>
  <Segment value="member">Member</Segment>
  <Segment value="accountant">Accountant</Segment>
</SegmentedButton>;
