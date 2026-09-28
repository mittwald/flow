import {
  Action,
  ActionGroup,
  Button,
  Content,
  Heading,
  IconDanger,
  IllustratedMessage,
  Modal,
  ModalTrigger,
  Text,
} from "@mittwald/flow-react-components";

export default () => (
  <ModalTrigger>
    <Button color="danger" variant="solid">
      E-Mail-Adresse löschen
    </Button>
    <Modal>
      <Content>
        <IllustratedMessage color="danger">
          <IconDanger />
          <Heading>Löschen fehlgeschlagen</Heading>
          <Text>
            Die E-Mail-Adresse konnte nicht gelöscht werden.
            Wir arbeiten daran, das Problem zu beheben.
            Bitte versuche es später noch einmal.
          </Text>
        </IllustratedMessage>
      </Content>
      <ActionGroup>
        <Action closeModal>
          <Button variant="soft" color="secondary">
            Schließen
          </Button>
        </Action>
      </ActionGroup>
    </Modal>
  </ModalTrigger>
);
