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
  useModalController,
} from "@mittwald/flow-remote-react-components";

const squadronExplainer =
  "Think of a squadron as your crew. This is where you rally your pilots, " +
  "assign ships, and plan your next mission.";

export default function Page() {
  const controller = useModalController();

  return (
    <Section>
      <Flex columnGap="s">
        <ModalTrigger>
          <Button>New squadron</Button>
          <Modal>
            <Heading>New squadron</Heading>
            <Content>
              <Section>
                <Heading>What is a squadron?</Heading>
                <Text>{squadronExplainer}</Text>
                <TextField isRequired>
                  <Label>Squadron name</Label>
                </TextField>
              </Section>
            </Content>
            <ActionGroup>
              <Action closeModal>
                <Button color="accent">Create squadron</Button>
                <Button variant="soft" color="secondary">
                  Cancel
                </Button>
              </Action>
            </ActionGroup>
          </Modal>
        </ModalTrigger>

        <ModalTrigger>
          <Button>Offcanvas</Button>
          <Modal offCanvas>
            <Heading>New squadron</Heading>
            <Content>
              <Section>
                <Heading>What is a squadron?</Heading>
                <Text>{squadronExplainer}</Text>
                <TextField isRequired>
                  <Label>Squadron name</Label>
                </TextField>
              </Section>
              <Section>
                <Heading>What is a squadron?</Heading>
                <Text>{squadronExplainer}</Text>
                <TextField isRequired>
                  <Label>Squadron name</Label>
                </TextField>
              </Section>
            </Content>
            <ActionGroup>
              <Action closeModal>
                <Button color="accent">Create squadron</Button>
                <Button variant="soft" color="secondary">
                  Cancel
                </Button>
              </Action>
            </ActionGroup>
          </Modal>
        </ModalTrigger>

        <ModalTrigger>
          <Button>With columns</Button>
          <Modal offCanvas size="l">
            <Heading>New squadron</Heading>
            <ColumnLayout>
              <Section>
                <Heading>What is a squadron?</Heading>
                <Text>{squadronExplainer}</Text>
                <TextField isRequired>
                  <Label>Squadron name</Label>
                </TextField>
              </Section>
              <Section>
                <Heading>What is a squadron?</Heading>
                <Text>{squadronExplainer}</Text>
                <TextField isRequired>
                  <Label>Squadron name</Label>
                </TextField>
              </Section>
            </ColumnLayout>
            <ActionGroup>
              <Action closeModal>
                <Button color="accent">Create squadron</Button>
                <Button variant="soft" color="secondary">
                  Cancel
                </Button>
              </Action>
            </ActionGroup>
          </Modal>
        </ModalTrigger>

        <LightBoxTrigger>
          <Button>Lightbox</Button>
          <LightBox>
            <Image src="https://flow.mittwald.de/assets/mittwald_logo_rgb.jpg" />
          </LightBox>
        </LightBoxTrigger>

        <Action onAction={() => console.log("Destroy the Death Star clicked")}>
          <Modal slot="actionConfirm">
            <Heading>Destroy the Death Star</Heading>
            <Content>
              Once the Death Star is destroyed, it cannot be rebuilt.
            </Content>
            <ActionGroup>
              <Button color="danger">Fire superlaser</Button>
              <Button color="secondary" variant="soft">
                Cancel
              </Button>
            </ActionGroup>
          </Modal>
          <Button color="danger">Destroy the Death Star</Button>
        </Action>
      </Flex>

      <Label>With controller</Label>
      <Button
        onPress={() => {
          controller.open();
        }}
      >
        New squadron
      </Button>
      <Modal controller={controller}>
        <Heading>New squadron</Heading>
        <Content>
          <Section>
            <Text>{squadronExplainer}</Text>
            <TextField isRequired>
              <Label>Squadron name</Label>
            </TextField>
          </Section>
        </Content>
        <ActionGroup>
          <Action closeModal>
            <Button color="accent">Create squadron</Button>
            <Button variant="soft" color="secondary">
              Cancel
            </Button>
          </Action>
        </ActionGroup>
      </Modal>
    </Section>
  );
}
