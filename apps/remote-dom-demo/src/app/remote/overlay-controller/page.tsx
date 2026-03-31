"use client";
import {
  Action,
  ActionGroup,
  Button,
  Content,
  Heading,
  Label,
  Modal,
  Section,
  Text,
  TextField,
  useModalController,
} from "@mittwald/flow-remote-react-components";

export default function Page() {
  const controller = useModalController();

  return (
    <>
      <Button
        onPress={() => {
          controller.open();
        }}
      >
        Modal trigger
      </Button>
      <Modal controller={controller}>
        <Heading>Modal title</Heading>
        <Content>
          <Section>
            <Text>
              Eine Organisation kannst du dir wie ein Unternehmen vorstellen. An
              diesem Ort verwaltest du deine Mitarbeiter, Zahlungsmodalitäten
              und kannst deine Rechnungen einsehen.
            </Text>
            <TextField isRequired>
              <Label>Organisationsname</Label>
            </TextField>
          </Section>
        </Content>
        <ActionGroup>
          <Action closeModal>
            <Button color="accent">Organisation anlegen</Button>
            <Button variant="soft" color="secondary">
              Abbrechen
            </Button>
          </Action>
        </ActionGroup>
      </Modal>
    </>
  );
}
