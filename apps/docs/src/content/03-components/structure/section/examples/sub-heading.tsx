import {
  Heading,
  InlineCode,
  Label,
  LabeledValue,
  Section,
  Text,
} from "@mittwald/flow-react-components";

<Section>
  <Heading>DNS Verwaltung</Heading>
  <Text>
    Da du externe Nameserver nutzt, empfehlen wir dir
    folgende Records bei deinem Provider einzutragen.
  </Text>
  <Heading level={3}>A-Record</Heading>
  <LabeledValue>
    <Label>IPv4-Adresse</Label>
    <InlineCode>12.123.123.12</InlineCode>
  </LabeledValue>
</Section>;
