import {
  Action,
  ActionGroup,
  Button,
  Content,
  Heading,
  Label,
  Modal,
  Section,
  Text,
  TextField,
  useOverlayController,
} from "@mittwald/flow-react-components";
import { sleepLong } from "@/content/04-components/actions/action/examples/lib";

export default () => {
  const controller = useOverlayController("Modal");

  return (
    <>
      <Button onPress={controller.open}>
        Modal öffnen
      </Button>

      <Modal controller={controller}>
        <Heading>Organisation anlegen</Heading>
        <Content>
          <Section>
            <Text>
              Eine Organisation kannst du dir wie ein
              Unternehmen vorstellen. An diesem Ort
              verwaltest du deine Mitarbeiter,
              Zahlungsmodalitäten und kannst deine
              Rechnungen einsehen.
            </Text>
            <TextField isRequired>
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
    </>
  );
};
