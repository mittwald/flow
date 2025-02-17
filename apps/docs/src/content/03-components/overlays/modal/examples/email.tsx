import { Text } from "@mittwald/flow-react-components";
import { TextField } from "@mittwald/flow-react-components";
import { Label } from "@mittwald/flow-react-components";
import { ActionGroup } from "@mittwald/flow-react-components";
import { Button } from "@mittwald/flow-react-components";
import { Heading } from "@mittwald/flow-react-components";
import { Action } from "@mittwald/flow-react-components";
import { IconEmail } from "@mittwald/flow-react-components";

<StaticModal>
  <div className="flow--modal--content">
    <Heading>
      <IconEmail />
      E-Mail-Adresse anlegen
    </Heading>
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
