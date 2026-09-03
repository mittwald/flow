import type { Meta, StoryObj } from "@storybook/react";
import { Combine } from "@/components/Combine";
import { Avatar } from "@/components/Avatar";
import { Initials } from "@/components/Initials";
import { Text } from "@/components/Text";
import { IconDomain } from "@/components/Icon/components/icons";
import Button from "@/components/Button";
import { Heading } from "@/components/Heading";
import {
  ContextualHelp,
  ContextualHelpTrigger,
} from "@/components/ContextualHelp";
import { CopyButton } from "@/components/CopyButton";

const meta: Meta<typeof Combine> = {
  title: "Structure/Combine",
  component: Combine,
  parameters: {
    controls: { disable: true },
  },
};
export default meta;

type Story = StoryObj<typeof Combine>;

export const AvatarText: Story = {
  render: (props) => (
    <Combine {...props}>
      <Avatar>
        <Initials>Han Solo</Initials>
      </Avatar>
      <Text>
        <strong>Han Solo</strong>
        Rebel Alliance general
      </Text>
    </Combine>
  ),
};

export const IconText: Story = {
  render: (props) => (
    <Combine {...props}>
      <IconDomain />
      <Text>comms.rebellion.org</Text>
    </Combine>
  ),
};

export const TextContextualHelp: Story = {
  render: (props) => (
    <Combine {...props}>
      <Text>Price</Text>

      <ContextualHelpTrigger>
        <Button color="secondary" />

        <ContextualHelp>
          <Heading>Price Information</Heading>
          <Text>This prices are not final and may change.</Text>
        </ContextualHelp>
      </ContextualHelpTrigger>
    </Combine>
  ),
};

export const TextCopyButton: Story = {
  render: (props) => (
    <Combine {...props}>
      <Text>comms.rebellion.org</Text>
      <CopyButton text="comms.rebellion.org" />
    </Combine>
  ),
};
