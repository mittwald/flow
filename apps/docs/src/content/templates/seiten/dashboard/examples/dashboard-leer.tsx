import {
  Button,
  Flex,
  Heading,
  IconProject,
  IllustratedMessage,
  LayoutCard,
  Text,
} from "@mittwald/flow-react-components";

export default () => (
  <Flex direction="column" gap="m">
    <Heading color="dark" level={1}>
      Projekt „Mustermann“
    </Heading>

    <LayoutCard>
      <IllustratedMessage>
        <IconProject />
        <Heading>Projekt wird bereitgestellt</Heading>
        <Text>
          Sobald das Projekt fertig eingerichtet ist,
          erscheinen hier die Kacheln mit Zustand und
          Einstieg. Das dauert in der Regel wenige Minuten.
        </Text>
        <Button variant="soft" color="secondary">
          Status aktualisieren
        </Button>
      </IllustratedMessage>
    </LayoutCard>
  </Flex>
);
