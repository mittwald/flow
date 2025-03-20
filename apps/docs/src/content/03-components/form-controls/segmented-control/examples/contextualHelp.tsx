import {
  Button,
  ContextualHelp,
  ContextualHelpTrigger,
  Heading,
  Label,
  Segment,
  SegmentedControl,
  Text,
} from "@mittwald/flow-react-components";

<SegmentedControl defaultValue="lastschrift">
  <Label>
    Zahlungsart
    <ContextualHelpTrigger>
      <Button />
      <ContextualHelp>
        <Heading>Weitere Informationen</Heading>
        <Text>
          Hier gibt es weitere Informationen, die zu lang
          für die FieldDescription sind.
        </Text>
      </ContextualHelp>
    </ContextualHelpTrigger>
  </Label>
  <Segment value="lastschrift">Lastschrift</Segment>
  <Segment value="Rechnung">Rechnung</Segment>
</SegmentedControl>;
