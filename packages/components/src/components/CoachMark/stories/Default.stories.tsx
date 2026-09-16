import type { Meta, StoryObj } from "@storybook/react";
import { useRef } from "react";
import { CoachMark } from "@/components/CoachMark";
import { Button } from "@/components/Button";
import { Heading } from "@/components/Heading";
import { Section } from "@/components/Section";
import { Text } from "@/components/Text";
import { useOverlayController } from "@/lib/controller";

// Enough page to scroll: a coach mark neither blocks it nor closes.
const pageContent = Array.from({ length: 12 }, (_, index) => (
  <Text key={index}>
    A long time ago in a galaxy far, far away, the Rebel Alliance struck a
    decisive blow against the Galactic Empire. Rebel spies managed to steal
    secret plans to the Empire&apos;s ultimate weapon, the Death Star, an
    armored space station with enough power to destroy an entire planet.
  </Text>
));

const meta: Meta<typeof CoachMark> = {
  title: "Overlays/CoachMark",
  component: CoachMark,
  parameters: {
    controls: { disable: true },
  },
  render: (props) => {
    // oxlint-disable-next-line react-hooks/rules-of-hooks
    const anchor = useRef<HTMLButtonElement>(null);
    // oxlint-disable-next-line react-hooks/rules-of-hooks
    const controller = useOverlayController("CoachMark", {
      isDefaultOpen: true,
    });

    return (
      <Section>
        <Button ref={anchor} onPress={() => controller.open()}>
          Assign a rank
        </Button>

        <CoachMark {...props} anchorRef={anchor} controller={controller}>
          <Heading>New: assign a rank</Heading>
          <Text>
            You can now assign a rank right here, without going through the
            squadron overview.
          </Text>
        </CoachMark>

        {pageContent}
      </Section>
    );
  },
};
export default meta;

type Story = StoryObj<typeof CoachMark>;

export const Default: Story = {};

export const CustomDismissLabel: Story = {
  args: {
    dismissLabel: "Ausprobieren",
  },
};
