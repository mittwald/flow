import {
  ActionGroup,
  Button,
  Heading,
  IconProject,
  IllustratedMessage,
  Text,
  LayoutCard,
} from "@mittwald/flow-react-components";

<LayoutCard>
  <IllustratedMessage>
    <IconProject />
    <Heading>Erstes Projekt anlegen</Heading>
    <Text>
      Du hast noch keine Projekte angelegt! Lege ein Projekt
      an und schon kannst du mit dem Entwickeln loslegen.
    </Text>

    <ActionGroup>
      <Button color="secondary" variant="soft">
        Tarif bestellen
      </Button>
      <Button color="accent">Anlegen</Button>
    </ActionGroup>
  </IllustratedMessage>
</LayoutCard>;
