import {
  ActionGroup,
  Button,
  Flex,
  Heading,
  IconProject,
  IllustratedMessage,
  LayoutCard,
  Text,
} from "@mittwald/flow-react-components";

export default () => {
  return (
    <Flex direction="column" gap="m">
      <Heading level={1} color="light">
        Projekte
      </Heading>
      <LayoutCard>
        <IllustratedMessage>
          <IconProject />
          <Heading>Erstes Projekt anlegen</Heading>
          <Text>
            Du hast noch keine Projekte angelegt! Lege ein
            Projekt an und schon kannst du mit dem
            Entwickeln loslegen.
          </Text>
          <ActionGroup>
            <Button color="accent">Anlegen</Button>
            <Button
              slot="secondary"
              color="secondary"
              variant="soft"
            >
              Tarif bestellen
            </Button>
          </ActionGroup>
        </IllustratedMessage>
      </LayoutCard>
    </Flex>
  );
};
