import {
  Segment,
  SegmentedControl,
} from "@mittwald/flow-react-components/SegmentedControl";
import { Label } from "@mittwald/flow-react-components/Label";
import { FieldDescription } from "@mittwald/flow-react-components/FieldDescription";

<SegmentedControl defaultValue="cloud">
  <Label>Speicherplatz</Label>
  <Segment value="cloud">Cloud</Segment>
  <Segment value="lokal">Lokal</Segment>
  <FieldDescription>
    Speicherplatz kann jederzeit geändert werden
  </FieldDescription>
</SegmentedControl>;
