import {
  ColumnLayout,
  Label,
  Segment,
  SegmentedControl,
} from "@mittwald/flow-react-components";

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
