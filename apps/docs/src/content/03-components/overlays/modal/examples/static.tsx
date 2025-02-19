import { Text } from "@mittwald/flow-react-components";
import { TextField } from "@mittwald/flow-react-components";
import { Label } from "@mittwald/flow-react-components";
import { ActionGroup } from "@mittwald/flow-react-components";
import { Button } from "@mittwald/flow-react-components";
import { Heading } from "@mittwald/flow-react-components";
import { Action } from "@mittwald/flow-react-components";
import { Section } from "@mittwald/flow-react-components";

<StaticModal>
  <header className="flow--modal--header">
    <Heading>Organisation anlegen</Heading>
  </header>

  <div className="flow--modal--content">
    <Section>
      <Text>
        Eine Organisation kannst du dir wie ein Unternehmen
        vorstellen. An diesem Ort verwaltest du deine
        Mitarbeiter, Zahlungsmodalitäten und kannst deine
        Rechnungen einsehen.
      </Text>
      <TextField>
        <Label>Organisationsname</Label>
      </TextField>
    </Section>
  </div>
  <ActionGroup className="flow--modal--action-group">
    <Action closeOverlay="Modal">
      <Button color="accent">Organisation anlegen</Button>
      <Button variant="soft" color="secondary">
        Abbrechen
      </Button>
    </Action>
  </ActionGroup>
</StaticModal>;
