import {
  Action,
  ActionGroup,
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
          Das lässt sich nicht rückgängig machen. Die
          Weiterleitung von <b>kontakt@mustermann.de</b> auf
          diese Adresse geht danach ins Leere.
        </Text>
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
