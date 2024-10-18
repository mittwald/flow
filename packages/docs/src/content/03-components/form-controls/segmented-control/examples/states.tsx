import {
  Segment,
  SegmentedControl,
} from "@mittwald/flow-react-components/SegmentedControl";
import { Label } from "@mittwald/flow-react-components/Label";
import { Section } from "@mittwald/flow-react-components/Section";

<Section>
  <SegmentedControl defaultValue="dev">
    <Label>Rolle</Label>
    <Segment value="entwickler">Entwickler</Segment>
    <Segment value="designer">Designer</Segment>
    <Segment value="geschäftsführer">
      Geschäftsführer
    </Segment>
    <Segment value="andere">Andere</Segment>
  </SegmentedControl>
  <SegmentedControl
    variant="segmented"
    defaultValue="dev"
    isDisabled
  >
    <Label>Rolle</Label>
    <Segment value="entwickler">Entwickler</Segment>
    <Segment value="designer">Designer</Segment>
    <Segment value="geschäftsführer">
      Geschäftsführer
    </Segment>
    <Segment value="andere">Andere</Segment>
  </SegmentedControl>
</Section>;
