import Text from "@mittwald/flow-react-components/Text";
import TextField from "@mittwald/flow-react-components/TextField";
import Label from "@mittwald/flow-react-components/Label";
import ActionGroup from "@mittwald/flow-react-components/ActionGroup";
import Button from "@mittwald/flow-react-components/Button";
import Heading from "@mittwald/flow-react-components/Heading";
import Action from "@mittwald/flow-react-components/Action";
import { IconEmail } from "@mittwald/flow-react-components/Icons";

<StaticModal>
  <div className="flow--modal--content">
    <Heading levelVisual={4}>
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
