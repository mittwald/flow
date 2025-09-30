import {
  Action,
  ActionGroup,
  Button,
  Heading,
  Label,
  Text,
  TextField,
} from "@mittwald/flow-react-components";

<StaticModal>
  <div className="flow--modal--content">
    <Heading>E-Mail-Adresse anlegen</Heading>
    <Text>
      Erstelle dir eine E-Mail-Adresse mit Postfach
      Speicherplatz.
    </Text>
    <TextField type="email">
      <Label>E-Mail-Adresse</Label>
    </TextField>
  </div>
  <ActionGroup className="flow--modal--action-group">
    <Action closeOverlay="Modal">
      <Button color="accent">E-Mail-Adresse anlegen</Button>
      <Button variant="soft" color="secondary">
        Abbrechen
      </Button>
    </Action>
  </ActionGroup>
</StaticModal>;
