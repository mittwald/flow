import {
  Label,
  Segment,
  SegmentedControl,
} from "@mittwald/flow-react-components";

<SegmentedControl defaultValue="individuell">
  <Label>Wähle deine Einstellungsart aus:</Label>
  <Segment value="standard">Standard-Einstellungen</Segment>
  <Segment value="individuell">
    Individuell einstellbare Einstellungen
  </Segment>
</SegmentedControl>;
