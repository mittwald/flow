"use client";
import {
  Button,
  Heading,
  Modal,
  ModalTrigger,
  Content,
  Section,
  Text,
  ActionGroup,
  Label,
  TextField,
  Action,
} from "@mittwald/flow-remote-react-components";

export default function Page() {
  return (
    <>
      <ModalTrigger>
        <Button>Modal trigger</Button>
        <Modal>
          <Heading>Modal title</Heading>
          <Content>
            <Section>
              <Text>
                Eine Organisation kannst du dir wie ein Unternehmen vorstellen.
                An diesem Ort verwaltest du deine Mitarbeiter,
                Zahlungsmodalitäten und kannst deine Rechnungen einsehen.
              </Text>
              <TextField isRequired>
                <Label>Organisationsname</Label>
              </TextField>
            </Section>
          </Content>
          <ActionGroup>
            <Action closeOverlay="Modal">
              <Button color="accent">Organisation anlegen</Button>
              <Button variant="soft" color="secondary">
                Abbrechen
              </Button>
            </Action>
          </ActionGroup>
        </Modal>
      </ModalTrigger>
    </>
  );
}
