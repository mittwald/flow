import Button from "@mittwald/flow-react-components/Button";
import TextField from "@mittwald/flow-react-components/TextField";
import Label from "@mittwald/flow-react-components/Label";
import Heading from "@mittwald/flow-react-components/Heading";
import ButtonGroup from "@mittwald/flow-react-components/ButtonGroup";

<StaticModal>
  <div className="flow--modal--content">
    <Heading>Projekt anlegen</Heading>
    <TextField>
      <Label>Projekt Name</Label>
    </TextField>
  </div>
  <ButtonGroup className="flow--modal--button-group">
    <Button>Weiter</Button>
    <Button variant="soft" color="secondary">
      Abbrechen
    </Button>
  </ButtonGroup>
</StaticModal>;
