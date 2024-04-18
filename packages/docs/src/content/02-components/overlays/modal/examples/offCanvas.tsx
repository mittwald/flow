import Modal, {
  ModalTrigger,
} from "@mittwald/flow-react-components/Modal";
import Content from "@mittwald/flow-react-components/Content";
import Text from "@mittwald/flow-react-components/Text";
import TextField from "@mittwald/flow-react-components/TextField";
import Label from "@mittwald/flow-react-components/Label";
import ButtonGroup from "@mittwald/flow-react-components/ButtonGroup";
import Button from "@mittwald/flow-react-components/Button";
import Heading from "@mittwald/flow-react-components/Heading";
import Action from "@mittwald/flow-react-components/Action";

<ModalTrigger>
  <Button variant="accent">Organisation anlegen</Button>
  <Modal offCanvas>
    <Heading>Neue Organisation</Heading>
    <Content>
      <Text>
        Eine Organisation kannst du dir wie ein Unternehmen
        vorstellen. An diesem Ort verwaltest du deine
        Mitarbeiter, Zahlungsmodalitäten und kannst deine
        Rechnungen einsehen.
      </Text>
      <TextField>
        <Label>Organisationsname</Label>
      </TextField>
    </Content>
    <ButtonGroup>
      <Action closeModal>
        <Button variant="accent">
          Organisation anlegen
        </Button>
        <Button style="soft" variant="secondary">
          Abbrechen
        </Button>
      </Action>
    </ButtonGroup>
  </Modal>
</ModalTrigger>;
