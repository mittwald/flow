import {
  Segment,
  SegmentedControl,
} from "@mittwald/flow-react-components";
import { Label } from "@mittwald/flow-react-components";

<SegmentedControl defaultValue="lastschrift">
  <Label>Zahlungsart</Label>
  <Segment value="lastschrift">Lastschrift</Segment>
  <Segment value="Rechnung">Rechnung</Segment>
</SegmentedControl>;
