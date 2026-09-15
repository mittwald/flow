import type { Meta, StoryObj } from "@storybook/react";
import { useRef } from "react";
import {
  ContextualHelp,
  ContextualHelpTrigger,
} from "@/components/ContextualHelp";
import { Text } from "@/components/Text";
import { Link } from "@/components/Link";
import { Button } from "@/components/Button";
import { Heading } from "@/components/Heading";
import { Section } from "@/components/Section";
import { useOverlayController } from "@/lib/controller";

// Enough page to scroll: a modal contextual help blocks that, a non-modal one
// does not.
const pageContent = Array.from({ length: 12 }, (_, index) => (
  <Text key={index}>
    A long time ago in a galaxy far, far away, the Rebel Alliance struck a
    decisive blow against the Galactic Empire. Rebel spies managed to steal
    secret plans to the Empire&apos;s ultimate weapon, the Death Star, an
    armored space station with enough power to destroy an entire planet.
  </Text>
));

const meta: Meta<typeof ContextualHelp> = {
  title: "Overlays/ContextualHelp",
  component: ContextualHelp,
  parameters: {
    controls: { disable: true },
  },
  render: (props) => (
    <Section>
      <ContextualHelpTrigger subject="ranks & roles">
        <Button />
        <ContextualHelp {...props}>
          <Heading>Ranks & roles</Heading>
          <Text>
            Each member of the Rebel Alliance is assigned a rank for every
            mission and/or squadron. This allows the fleet to coordinate the
            fight against the Empire in a completely new and modern way.
          </Text>
          <Link>Learn more</Link>
        </ContextualHelp>
      </ContextualHelpTrigger>
      {pageContent}
    </Section>
  ),
};
export default meta;

type Story = StoryObj<typeof ContextualHelp>;

export const Default: Story = {};

/*
 * The feature spotlight: it opens on its own, points at a control the user did
 * not ask about, and is dismissed with its own button. Scroll the page — it
 * stays, and rides along with its anchor.
 */
const Spotlight = () => {
  const anchor = useRef<HTMLButtonElement>(null);
  const controller = useOverlayController("ContextualHelp", {
    isDefaultOpen: true,
  });

  return (
    <Section>
      <Button ref={anchor} onPress={() => controller.open()}>
        Assign a rank
      </Button>

      <ContextualHelp
        controller={controller}
        triggerRef={anchor}
        modality="non-modal"
        width={320}
      >
        <Heading>New: assign a rank</Heading>
        <Text>
          You can now assign a rank right here, without going through the
          squadron overview.
        </Text>
        <Button size="s" onPress={() => controller.close()}>
          Got it
        </Button>
      </ContextualHelp>

      {pageContent}
    </Section>
  );
};

export const NonModal: Story = {
  args: {
    modality: "non-modal",
  },
  render: () => <Spotlight />,
};
