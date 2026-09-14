import {
  Action,
  ActionGroup,
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
  const profileName = "Max Mustermann";
  const [confirmation, setConfirmation] = useState("");

  return (
    <ModalTrigger>
      <Button color="danger" variant="soft">
        Profil löschen
      </Button>
      <Modal>
        <Heading>Profil löschen</Heading>
        <Content>
          <Text>
            Das Profil <b>{profileName}</b> wird mit allen
            zugehörigen Daten und Zugriffsrechten gelöscht.
            Das lässt sich nicht rückgängig machen.
          </Text>
          <TextField
            value={confirmation}
            onChange={setConfirmation}
            isRequired
          >
            <Label>Namen eingeben</Label>
            <FieldDescription>
              Tippe <b>{profileName}</b> ab, um das Löschen
              zu bestätigen.
            </FieldDescription>
          </TextField>
        </Content>
        <ActionGroup>
          <Action closeModal>
            <Button
              color="danger"
              isDisabled={confirmation !== profileName}
            >
              Profil löschen
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
