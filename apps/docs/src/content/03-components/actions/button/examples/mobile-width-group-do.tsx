import { Button } from "@mittwald/flow-react-components";
import { TextField } from "@mittwald/flow-react-components";
import { Label } from "@mittwald/flow-react-components";
import { Heading } from "@mittwald/flow-react-components";
import { ActionGroup } from "@mittwald/flow-react-components";

<StaticModal>
  <header className="flow--modal--header">
    <Heading>Projekt anlegen</Heading>
  </header>
  <div className="flow--modal--content">
    <TextField>
      <Label>Projekt Name</Label>
    </TextField>
  </div>
  <ActionGroup className="flow--modal--action-group">
    <Button>Weiter</Button>
    <Button variant="soft" color="secondary">
      Abbrechen
    </Button>
  </ActionGroup>
</StaticModal>;
