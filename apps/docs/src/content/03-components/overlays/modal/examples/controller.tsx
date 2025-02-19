import { Modal } from "@mittwald/flow-react-components";
import { Content } from "@mittwald/flow-react-components";
import { Text } from "@mittwald/flow-react-components";
import { TextField } from "@mittwald/flow-react-components";
import { Label } from "@mittwald/flow-react-components";
import { ActionGroup } from "@mittwald/flow-react-components";
import { Button } from "@mittwald/flow-react-components";
import { Heading } from "@mittwald/flow-react-components";
import { Action } from "@mittwald/flow-react-components";
import { sleepLong } from "@/content/03-components/actions/action/examples/lib";
import { useOverlayController } from "@mittwald/flow-react-components";
import { Section } from "@mittwald/flow-react-components";

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
    </>
  );
};
