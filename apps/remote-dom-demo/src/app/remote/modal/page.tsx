"use client";
import {
  Action,
  ActionGroup,
  Button,
  ColumnLayout,
  Content,
  Flex,
  Heading,
  Image,
  Label,
  LightBox,
  LightBoxTrigger,
  Modal,
  ModalTrigger,
  Section,
  Text,
  TextField,
} from "@mittwald/flow-remote-react-components";

export default function Page() {
  return (
    <Flex columnGap="s">
      <ModalTrigger>
        <Button>Modal trigger</Button>
        <Modal>
          <Heading>Modal title</Heading>
          <Content>
            <Section>
              <Heading>Bla</Heading>
              <Text>
                Eine Organisation kannst du dir wie ein Unternehmen vorstellen.
                An diesem Ort verwaltest du deine Mitarbeiter,
                Zahlungsmodalitäten und kannst deine Rechnungen einsehen.
              </Text>
              <TextField isRequired>
                <Label>Organisationsname</Label>
              </TextField>
            </Section>
          </Content>
          <ActionGroup>
            <Action closeOverlay="Modal">
              <Button color="accent">Organisation anlegen</Button>
              <Button variant="soft" color="secondary">
                Abbrechen
              </Button>
            </Action>
          </ActionGroup>
        </Modal>
      </ModalTrigger>

      <ModalTrigger>
        <Button>Offcanvas</Button>
        <Modal offCanvas>
          <Heading>Modal title</Heading>
          <Content>
            <Section>
              <Heading>Bla</Heading>
              <Text>
                Eine Organisation kannst du dir wie ein Unternehmen vorstellen.
                An diesem Ort verwaltest du deine Mitarbeiter,
                Zahlungsmodalitäten und kannst deine Rechnungen einsehen.
              </Text>
              <TextField isRequired>
                <Label>Organisationsname</Label>
              </TextField>
            </Section>
            <Section>
              <Heading>Bla</Heading>
              <Text>
                Eine Organisation kannst du dir wie ein Unternehmen vorstellen.
                An diesem Ort verwaltest du deine Mitarbeiter,
                Zahlungsmodalitäten und kannst deine Rechnungen einsehen.
              </Text>
              <TextField isRequired>
                <Label>Organisationsname</Label>
              </TextField>
            </Section>
          </Content>
          <ActionGroup>
            <Action closeOverlay="Modal">
              <Button color="accent">Organisation anlegen</Button>
              <Button variant="soft" color="secondary">
                Abbrechen
              </Button>
            </Action>
          </ActionGroup>
        </Modal>
      </ModalTrigger>

      <ModalTrigger>
        <Button>With columns</Button>
        <Modal offCanvas size="l">
          <Heading>Modal title</Heading>
          <ColumnLayout>
            <Section>
              <Heading>Bla</Heading>
              <Text>
                Eine Organisation kannst du dir wie ein Unternehmen vorstellen.
                An diesem Ort verwaltest du deine Mitarbeiter,
                Zahlungsmodalitäten und kannst deine Rechnungen einsehen.
              </Text>
              <TextField isRequired>
                <Label>Organisationsname</Label>
              </TextField>
            </Section>
            <Section>
              <Heading>Bla</Heading>
              <Text>
                Eine Organisation kannst du dir wie ein Unternehmen vorstellen.
                An diesem Ort verwaltest du deine Mitarbeiter,
                Zahlungsmodalitäten und kannst deine Rechnungen einsehen.
              </Text>
              <TextField isRequired>
                <Label>Organisationsname</Label>
              </TextField>
            </Section>
          </ColumnLayout>
          <ActionGroup>
            <Action closeOverlay="Modal">
              <Button color="accent">Organisation anlegen</Button>
              <Button variant="soft" color="secondary">
                Abbrechen
              </Button>
            </Action>
          </ActionGroup>
        </Modal>
      </ModalTrigger>

      <LightBoxTrigger>
        <Button>Lightbox</Button>
        <LightBox>
          <Image src="https://mittwald.github.io/flow/assets/mittwald_logo_rgb.jpg" />
        </LightBox>
      </LightBoxTrigger>

      <Action onAction={() => console.log("Projekt löschen clicked")}>
        <Modal slot="actionConfirm">
          <Heading>Projekt löschen</Heading>
          <Content>
            Wenn das Projekt &quot;Test&quot; einmal gelöscht ist, kann es nicht
            wiederhergestellt werden.
          </Content>
          <ActionGroup>
            <Button color="danger">Löschen</Button>
            <Button color="secondary" variant="soft">
              Abbrechen
            </Button>
          </ActionGroup>
        </Modal>
        <Button color="danger">Projekt löschen</Button>
      </Action>
    </Flex>
  );
}
