import {
  Segment,
  SegmentedControl,
} from "@mittwald/flow-react-components/SegmentedControl";
import { Label } from "@mittwald/flow-react-components/Label";

<SegmentedControl defaultValue="lastschrift">
  <Label>Zahlungsart</Label>
  <Segment value="lastschrift">Lastschrift</Segment>
  <Segment value="Rechnung">Rechnung</Segment>
</SegmentedControl>;
