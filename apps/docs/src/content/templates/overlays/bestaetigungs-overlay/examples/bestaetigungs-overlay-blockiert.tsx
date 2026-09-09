import {
  Action,
  ActionGroup,
  Alert,
  Button,
  Content,
  Heading,
  Modal,
  ModalTrigger,
  Text,
} from "@mittwald/flow-react-components";

export default () => (
  <ModalTrigger>
    <Button color="danger" variant="soft">
      Domain löschen
    </Button>
    <Modal>
      <Heading>Domain löschen</Heading>
      <Content>
        <Text>
          Die Domain <b>mustermann.de</b> lässt sich derzeit
          nicht löschen.
        </Text>
        <Alert status="warning">
          <Heading>
            Drei E-Mail-Adressen nutzen diese Domain
          </Heading>
          <Content>
            max@mustermann.de, info@mustermann.de und
            kontakt@mustermann.de müssen zuerst gelöscht
            oder auf eine andere Domain umgezogen werden.
          </Content>
        </Alert>
      </Content>
      <ActionGroup>
        <Action closeModal>
          <Button color="danger" isDisabled>
            Löschen
          </Button>
          <Button variant="soft" color="secondary">
            Abbrechen
          </Button>
        </Action>
      </ActionGroup>
    </Modal>
  </ModalTrigger>
);
