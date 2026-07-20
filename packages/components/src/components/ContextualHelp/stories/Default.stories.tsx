import type { Meta, StoryObj } from "@storybook/react";
import {
  ContextualHelp,
  ContextualHelpTrigger,
} from "@/components/ContextualHelp";
import { Heading } from "@/components/Heading";
import { Text } from "@/components/Text";
import { Link } from "@/components/Link";
import { Button } from "@/components/Button";

const meta: Meta<typeof ContextualHelp> = {
  title: "Overlays/ContextualHelp",
  component: ContextualHelp,
  parameters: {
    controls: { disable: true },
  },
  render: (props) => (
    <ContextualHelpTrigger>
      <Button />
      <ContextualHelp {...props}>
        <Heading>Ranks & roles</Heading>
        <Text>
          Each member of the Rebel Alliance is assigned a rank for every mission
          and/or squadron. This allows the fleet to coordinate the fight against
          the Empire in a completely new and modern way.
        </Text>
        <Link>Learn more</Link>
      </ContextualHelp>
    </ContextualHelpTrigger>
  ),
};
export default meta;

type Story = StoryObj<typeof ContextualHelp>;

export const Default: Story = {};
