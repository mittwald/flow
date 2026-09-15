import {
  Action,
  ActionGroup,
  Alert,
  Button,
  Content,
  FieldDescription,
  Heading,
  Label,
  Modal,
  ModalTrigger,
  Text,
  TextField,
} from "@mittwald/flow-react-components";
import { useState } from "react";

export default () => {
  const projectName = "Mustermann";
  const [confirmation, setConfirmation] = useState("");

  return (
    <ModalTrigger>
      <Button color="danger" variant="soft">
        Projekt löschen
      </Button>
      <Modal>
        <Heading>Projekt löschen</Heading>
        <Content>
          <Text>
            Das Projekt <b>{projectName}</b> wird mit allen
            Apps, Datenbanken und E-Mail-Adressen gelöscht.
            Das lässt sich nicht rückgängig machen.
          </Text>
          <Alert status="danger">
            <Heading>
              3 E-Mail-Adressen und 1 Datenbank hängen daran
            </Heading>
            <Content>
              Auch sie werden gelöscht, einschließlich aller
              gespeicherten E-Mails.
            </Content>
          </Alert>
          <TextField
            value={confirmation}
            onChange={setConfirmation}
            isRequired
          >
            <Label>Projektnamen eingeben</Label>
            <FieldDescription>
              Tippe <b>{projectName}</b> ab, um das Löschen
              zu bestätigen.
            </FieldDescription>
          </TextField>
        </Content>
        <ActionGroup>
          <Action closeModal>
            <Button
              color="danger"
              isDisabled={confirmation !== projectName}
            >
              Projekt löschen
            </Button>
            <Button variant="soft" color="secondary">
              Abbrechen
            </Button>
          </Action>
        </ActionGroup>
      </Modal>
    </ModalTrigger>
  );
};
