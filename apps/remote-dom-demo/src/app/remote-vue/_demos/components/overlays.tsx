/** @jsxImportSource @/app/remote-vue/_lib */
import { ComponentGroupPage } from "@/app/remote-vue/_demos/components/lib/ComponentGroupPage";
import {
  Action,
  ActionGroup,
  Button,
  CoachMark,
  Content,
  ContextualHelp,
  ContextualHelpTrigger,
  Heading,
  IconEdit,
  Image,
  Label,
  LightBox,
  LightBoxTrigger,
  Link,
  Modal,
  ModalTrigger,
  Popover,
  PopoverTrigger,
  Section,
  Text,
  TextField,
  Tooltip,
  TooltipTrigger,
} from "@mittwald/flow-remote-vue-components";
import { defineComponent, ref } from "vue";

/** The counterpart of `src/app/remote/components/overlays/page.tsx`. */
export const OverlaysDemo = defineComponent({
  name: "OverlaysDemo",

  setup() {
    const isCoachMarkOpen = ref(false);

    return () => (
      <ComponentGroupPage title="Overlays">
        <Section>
          <Heading level={3}>CoachMark</Heading>
          {/* The anchor is given by id, not by ref: a ref never reaches the
              host, an id does. The host looks the element up once the coach
              mark opens. */}
          <Button
            id="coach-mark-anchor"
            onPress={() => (isCoachMarkOpen.value = true)}
          >
            Arm the superlaser
          </Button>
          <CoachMark
            anchor="coach-mark-anchor"
            isOpen={isCoachMarkOpen.value}
            onOpenChange={(isOpen: boolean) => (isCoachMarkOpen.value = isOpen)}
          >
            <Heading>New: arm it from here</Heading>
            <Text>
              Arming the superlaser no longer takes a trip to the reactor
              control room.
            </Text>
            <Button onPress={() => (isCoachMarkOpen.value = false)}>
              Got it
            </Button>
          </CoachMark>
        </Section>

        <Section>
          <Heading level={3}>ContextualHelp</Heading>
          <ContextualHelpTrigger subject="Clearance levels">
            <Button />
            <ContextualHelp>
              <Text>
                Every pilot gets a clearance level per squadron. It decides
                which hangars they may enter.
              </Text>
              <Link href="#">Learn more</Link>
            </ContextualHelp>
          </ContextualHelpTrigger>
        </Section>

        <Section>
          <Heading level={3}>LightBox</Heading>
          <LightBoxTrigger>
            <Button>Show holo image</Button>
            <LightBox>
              <Image src="https://flow.mittwald.de/assets/mittwald_logo_rgb.jpg" />
            </LightBox>
          </LightBoxTrigger>
        </Section>

        <Section>
          <Heading level={3}>Modal</Heading>
          <ModalTrigger>
            <Button>New squadron</Button>
            <Modal>
              <Heading>New squadron</Heading>
              <Content>
                <Text>
                  Think of a squadron as your crew. This is where you rally your
                  pilots, assign ships, and plan your next mission.
                </Text>
                <TextField isRequired>
                  <Label>Squadron name</Label>
                </TextField>
              </Content>
              <ActionGroup>
                <Action closeModal>
                  <Button color="success">Create squadron</Button>
                  <Button variant="soft" color="secondary">
                    Cancel
                  </Button>
                </Action>
              </ActionGroup>
            </Modal>
          </ModalTrigger>
        </Section>

        <Section>
          <Heading level={3}>Popover</Heading>
          <PopoverTrigger>
            <Button>Show battle station status</Button>
            <Popover>
              <Text>The Death Star is fully operational.</Text>
            </Popover>
          </PopoverTrigger>
        </Section>

        <Section>
          <Heading level={3}>Tooltip</Heading>
          <TooltipTrigger>
            <Button aria-label="Edit flight plan" variant="plain">
              <IconEdit />
            </Button>
            <Tooltip>Edit flight plan</Tooltip>
          </TooltipTrigger>
        </Section>
      </ComponentGroupPage>
    );
  },
});
