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
      E-Mail-Adresse löschen
    </Button>
    <Modal>
      <Heading>E-Mail-Adresse löschen</Heading>
      <Content>
        <Text>
          Die E-Mail-Adresse <b>max@mustermann.de</b> und
          alle darin gespeicherten E-Mails werden gelöscht.
          Das lässt sich nicht rückgängig machen.
        </Text>
        <Alert status="warning">
          <Heading>
            Eine Weiterleitung zeigt auf diese Adresse
          </Heading>
          <Content>
            kontakt@mustermann.de leitet an diese Adresse
            weiter und wird nach dem Löschen ins Leere
            gehen.
          </Content>
        </Alert>
      </Content>
      <ActionGroup>
        <Action closeModal>
          <Button color="danger">Löschen</Button>
          <Button variant="soft" color="secondary">
            Abbrechen
          </Button>
        </Action>
      </ActionGroup>
    </Modal>
  </ModalTrigger>
);
