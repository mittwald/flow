import {
  Alert,
  ColumnLayout,
  Content,
  Flex,
  Heading,
  Label,
  LabeledValue,
  LayoutCard,
  Section,
  Text,
} from "@mittwald/flow-react-components";

export default () => (
  <Flex direction="column" gap="m">
    <Heading color="dark" level={1}>
      max@mustermann.de
    </Heading>

    <Alert status="info">
      <Heading>E-Mail-Adresse wird eingerichtet</Heading>
      <Content>
        Die MX-Records der Domain werden gerade übernommen.
        Sobald das erledigt ist, empfängt die Adresse
        E-Mails – in der Regel innerhalb weniger Minuten. Es
        ist nichts weiter zu tun.
      </Content>
    </Alert>

    <LayoutCard>
      <Section>
        <Heading>E-Mail-Adresse</Heading>
        <ColumnLayout m={[1, 1]}>
          <LabeledValue>
            <Label>E-Mail-Adresse</Label>
            <Text>max@mustermann.de</Text>
          </LabeledValue>
          <LabeledValue>
            <Label>Status</Label>
            <Text>Wird eingerichtet</Text>
          </LabeledValue>
        </ColumnLayout>
      </Section>
    </LayoutCard>
  </Flex>
);
