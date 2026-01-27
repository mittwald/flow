import {
  Action,
  ActionGroup,
  Button,
  Content,
  Heading,
  Label,
  Modal,
  ModalTrigger,
  Section,
  Text,
  TextField,
} from "@mittwald/flow-react-components";
import { sleepLong } from "@/content/04-components/actions/action/examples/lib";

<ModalTrigger>
  <Button>OffCanvas öffnen</Button>
  <Modal offCanvas>
    <Heading>Organisation anlegen</Heading>
    <Content>
      <Section>
        <Text>
          Eine Organisation kannst du dir wie ein
          Unternehmen vorstellen. An diesem Ort verwaltest
          du deine Mitarbeiter, Zahlungsmodalitäten und
          kannst deine Rechnungen einsehen.
        </Text>
        <TextField>
          <Label>Organisationsname</Label>
        </TextField>
      </Section>
    </Content>
    <ActionGroup>
      <Action closeOverlay="Modal">
        <Action onAction={sleepLong}>
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
