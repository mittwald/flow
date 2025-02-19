import {
  FieldDescription,
  Label,
  Segment,
  SegmentedControl,
} from "@mittwald/flow-react-components";

<SegmentedControl defaultValue="cloud">
  <Label>Speicherplatz</Label>
  <Segment value="cloud">Cloud</Segment>
  <Segment value="lokal">Lokal</Segment>
  <FieldDescription>
    Speicherplatz kann jederzeit geändert werden
  </FieldDescription>
</SegmentedControl>;
