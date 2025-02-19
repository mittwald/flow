import {
  Segment,
  SegmentedControl,
} from "@mittwald/flow-react-components";
import { Label } from "@mittwald/flow-react-components";

<SegmentedControl defaultValue="ssh-key">
  <Label>Authentifizierungsart</Label>
  <Segment value="ssh-key">SSH-Key</Segment>
  <Segment value="passwort">Passwort</Segment>
</SegmentedControl>;
