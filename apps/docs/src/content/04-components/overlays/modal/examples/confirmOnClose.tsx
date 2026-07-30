import {
  Action,
  ActionGroup,
  Button,
  Content,
  Heading,
  Label,
  Modal,
  ModalTrigger,
  Text,
  TextField,
} from "@mittwald/flow-react-components";
import { useState } from "react";

export default () => {
  const [description, setDescription] = useState("");

  return (
    <ModalTrigger>
      <Button>Modal öffnen</Button>

      <Modal
        confirmOnClose={description !== ""}
        onClose={() => setDescription("")}
      >
        <Heading>Projekt-Beschreibung</Heading>

        <Content>
          <Text>
            Gib eine Beschreibung ein und schließe das Modal
            anschließend mit Escape oder per Klick außerhalb
            – das Verwerfen der Änderungen muss bestätigt
            werden.
          </Text>

          <TextField
            value={description}
            onChange={setDescription}
          >
            <Label>Beschreibung</Label>
          </TextField>
        </Content>

        <ActionGroup>
          <Action closeModal>
            <Button color="accent">Speichern</Button>
            <Button color="secondary" variant="soft">
              Abbrechen
            </Button>
          </Action>
        </ActionGroup>
      </Modal>
    </ModalTrigger>
  );
};
