/** @jsxImportSource @/app/remote-vue/_lib */
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
} from "@mittwald/flow-remote-vue-components";
import { defineComponent, type VNode } from "vue";

const squadronExplainer =
  "Think of a squadron as your crew. This is where you rally your pilots, " +
  "assign ships, and plan your next mission.";

const SquadronFields = () => (
  <Section>
    <Heading>What is a squadron?</Heading>
    <Text>{squadronExplainer}</Text>
    <TextField isRequired>
      <Label>Squadron name</Label>
    </TextField>
  </Section>
);

const ConfirmOnCloseFields = () => (
  <Section>
    <Text>
      Closing this modal with Escape or with a click outside has to be
      confirmed. Cancel closes it right away.
    </Text>
    <TextField isRequired>
      <Label>Squadron name</Label>
    </TextField>
  </Section>
);

/*
 * One `Action` around both buttons, the way the React page writes it: the
 * Vue rebuild maps every `Button` child, so both close the modal.
 */
const SquadronActions = () => (
  <ActionGroup>
    <Action closeModal>
      <Button color="success">Create squadron</Button>
      <Button variant="soft" color="secondary">
        Cancel
      </Button>
    </Action>
  </ActionGroup>
);

const squadronModalContent = (body: () => VNode | VNode[]) => [
  <Heading>New squadron</Heading>,
  <Content>{body()}</Content>,
  <SquadronActions />,
];

/**
 * The Vue counterpart of `/remote/modal`.
 *
 * Written against the same API as the React page — `ModalTrigger`, `Modal`,
 * `Action closeModal`, a controller, `LightBoxTrigger` — except that all of
 * them are this package's Vue rebuilds of Flow's React-only components, not
 * remote elements.
 *
 * One trigger of the React page is missing: the `Action` whose confirmation is
 * a `Modal slot="actionConfirm"`. The Vue `Action` has no confirmation modal of
 * its own — see the package's README.
 */
export const ModalDemo = defineComponent({
  name: "ModalDemo",

  setup() {
    const controller = useModalController();

    return () => (
      <Section>
        <Flex columnGap="s">
          <ModalTrigger>
            <Button>New squadron</Button>
            <Modal>{squadronModalContent(SquadronFields)}</Modal>
          </ModalTrigger>

          <ModalTrigger>
            <Button>Offcanvas</Button>
            <Modal offCanvas>
              {squadronModalContent(() => [
                <SquadronFields />,
                <SquadronFields />,
              ])}
            </Modal>
          </ModalTrigger>

          <ModalTrigger>
            <Button>With columns</Button>
            <Modal offCanvas size="l">
              <Heading>New squadron</Heading>
              <ColumnLayout>
                <SquadronFields />
                <SquadronFields />
              </ColumnLayout>
              <SquadronActions />
            </Modal>
          </ModalTrigger>

          <ModalTrigger>
            <Button>Confirm on close</Button>
            <Modal confirmOnClose>
              {squadronModalContent(ConfirmOnCloseFields)}
            </Modal>
          </ModalTrigger>

          <LightBoxTrigger>
            <Button>Lightbox</Button>
            <LightBox>
              <Image src="https://flow.mittwald.de/assets/mittwald_logo_rgb.jpg" />
            </LightBox>
          </LightBoxTrigger>
        </Flex>

        <Label>With controller</Label>
        <Button onPress={controller.open}>New squadron</Button>
        <Modal controller={controller}>
          {squadronModalContent(SquadronFields)}
        </Modal>
      </Section>
    );
  },
});
