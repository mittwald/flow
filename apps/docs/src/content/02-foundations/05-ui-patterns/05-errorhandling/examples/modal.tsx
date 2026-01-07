import {
  Action,
  ActionGroup,
  Button,
  Content,
  Flex,
  Heading,
  IconDanger,
  IconProject,
  IllustratedMessage,
  LayoutCard,
  Modal,
  Text,
  useOverlayController,
} from "@mittwald/flow-react-components";

export default () => {
  const controller = useOverlayController("Modal");

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
          <Action
            onAction={() => {
              controller.open();
              throw "failed";
            }}
          >
            <Button color="accent">Projekt anlegen</Button>
          </Action>
        </IllustratedMessage>
        <Modal controller={controller}>
          <Content>
            <IllustratedMessage color="danger">
              <IconDanger />
              <Heading>
                Fehler beim Ausführen der Aktion
              </Heading>
              <Text>
                Die Aktion konnte nicht ausgeführt werden.
                Wir arbeiten daran das Problem zu beheben.
                Bitte habe etwas Geduld und probiere es
                später noch einmal.
              </Text>
            </IllustratedMessage>
          </Content>
          <ActionGroup>
            <Action closeOverlay="Modal">
              <Button
                slot="primary"
                variant="soft"
                color="secondary"
              >
                Schließen
              </Button>
            </Action>
          </ActionGroup>
        </Modal>
      </LayoutCard>
    </Flex>
  );
};
