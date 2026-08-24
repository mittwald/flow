import {
  Action,
  ActionGroup,
  Button,
  Content,
  Heading,
  Modal,
  ModalTrigger,
  Section,
  Text,
} from "@mittwald/flow-react-components";

<ModalTrigger>
  <Button>Modal öffnen</Button>
  <Modal showCloseButton>
    <Heading>Datenbank verbinden</Heading>
    <Content>
      <Section>
        <Text>
          Verbinde deine Datenbank mit der Anwendung, um
          Inhalte zu speichern und abzurufen.
        </Text>
      </Section>
    </Content>
    <ActionGroup>
      <Action closeModal>
        <Button color="success">Verbinden</Button>
        <Button variant="soft" color="secondary">
          Abbrechen
        </Button>
      </Action>
    </ActionGroup>
  </Modal>
</ModalTrigger>;
