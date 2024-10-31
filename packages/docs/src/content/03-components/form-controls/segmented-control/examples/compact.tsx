import { Label } from "@mittwald/flow-react-components/Label";
import { ColumnLayout } from "@mittwald/flow-react-components/ColumnLayout";
import {
  Segment,
  SegmentedControl,
} from "@mittwald/flow-react-components/SegmentedControl";

<ColumnLayout m={[1, 1]}>
  <SegmentedControl
    defaultValue="entwickler"
    containerBreakpointSize="xl"
  >
    <Label>Rolle</Label>
    <Segment value="entwickler">Entwickler</Segment>
    <Segment value="geschäftsführer">
      Geschäftsführer
    </Segment>
    <Segment value="andere">Andere</Segment>
  </SegmentedControl>
  <SegmentedControl
    defaultValue="entwickler"
    containerBreakpointSize="xs"
  >
    <Label>Rolle</Label>
    <Segment value="entwickler">Entwickler</Segment>
    <Segment value="geschäftsführer">
      Geschäftsführer
    </Segment>
    <Segment value="andere">Andere</Segment>
  </SegmentedControl>
</ColumnLayout>;
