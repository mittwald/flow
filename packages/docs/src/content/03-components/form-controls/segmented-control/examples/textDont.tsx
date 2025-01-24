import {
  Segment,
  SegmentedControl,
} from "@mittwald/flow-react-components/SegmentedControl";
import { Label } from "@mittwald/flow-react-components/Label";

<SegmentedControl defaultValue="individuell">
  <Label>Wähle deine Einstellungsart aus:</Label>
  <Segment value="standard">Standard-Einstellungen</Segment>
  <Segment value="individuell">
    Individuell einstellbare Einstellungen
  </Segment>
</SegmentedControl>;
