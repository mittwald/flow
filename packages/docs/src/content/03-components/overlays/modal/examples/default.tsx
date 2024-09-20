import Modal, {
  ModalTrigger,
} from "@mittwald/flow-react-components/Modal";
import Content from "@mittwald/flow-react-components/Content";
import Text from "@mittwald/flow-react-components/Text";
import TextField from "@mittwald/flow-react-components/TextField";
import Label from "@mittwald/flow-react-components/Label";
import ActionGroup from "@mittwald/flow-react-components/ActionGroup";
import Button from "@mittwald/flow-react-components/Button";
import Heading from "@mittwald/flow-react-components/Heading";
import Action from "@mittwald/flow-react-components/Action";
import { sleepLong } from "@/content/03-components/actions/action/examples/lib";
import Section from "@mittwald/flow-react-components/Section";

<ModalTrigger>
  <Button>Modal öffnen</Button>
  <Modal>
    <Heading>Organisation anlegen</Heading>
    <Content>
      <Section>
        <Text>
          Eine Organisation kannst du dir wie ein
          Unternehmen vorstellen. An diesem Ort verwaltest
          du deine Mitarbeiter, Zahlungsmodalitäten und
          kannst deine Rechnungen einsehen.
        </Text>
        <TextField isRequired>
          <Label>Organisationsname</Label>
        </TextField>
      </Section>
    </Content>
    <ActionGroup>
      <Action closeOverlay="Modal">
        <Action action={sleepLong}>
          <Button color="accent">
            Organisation anlegen
          </Button>
        </Action>
        <Button variant="soft" color="secondary">
          Abbrechen
        </Button>
      </Action>
    </ActionGroup>
  </Modal>
</ModalTrigger>;
