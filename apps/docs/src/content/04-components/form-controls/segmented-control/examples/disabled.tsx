import {
  Label,
  Section,
  Segment,
  SegmentedControl,
} from "@mittwald/flow-react-components";

<Section>
  <SegmentedControl defaultValue="entwickler">
    <Label>Rolle</Label>
    <Segment value="entwickler">Entwickler</Segment>
    <Segment value="designer" isDisabled>
      Designer
    </Segment>
    <Segment value="geschäftsführer">
      Geschäftsführer
    </Segment>
    <Segment value="andere">Andere</Segment>
  </SegmentedControl>
  <SegmentedControl defaultValue="entwickler" isDisabled>
    <Label>Rolle</Label>
    <Segment value="entwickler">Entwickler</Segment>
    <Segment value="designer">Designer</Segment>
    <Segment value="geschäftsführer">
      Geschäftsführer
    </Segment>
    <Segment value="andere">Andere</Segment>
  </SegmentedControl>
</Section>;
