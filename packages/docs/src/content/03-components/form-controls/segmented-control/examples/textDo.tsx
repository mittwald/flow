import {
  Segment,
  SegmentedControl,
} from "@mittwald/flow-react-components/SegmentedControl";
import { Label } from "@mittwald/flow-react-components/Label";

<SegmentedControl
  variant="segmented"
  defaultValue="individuell"
>
  <Label>Einstellung</Label>
  <Segment value="standard">Standard</Segment>
  <Segment value="individuell">Individuell</Segment>
</SegmentedControl>;
