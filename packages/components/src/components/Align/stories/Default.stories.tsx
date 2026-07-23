import type { Meta, StoryObj } from "@storybook/react";
import { Align } from "@/components/Align";
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

const meta: Meta<typeof Align> = {
  title: "Structure/Align",
  component: Align,
  parameters: {
    controls: { disable: true },
  },
};
export default meta;

type Story = StoryObj<typeof Align>;

export const AvatarText: Story = {
  render: (props) => (
    <Align {...props}>
      <Avatar>
        <Initials>Han Solo</Initials>
      </Avatar>
      <Text>
        <strong>Han Solo</strong>
        Rebel Alliance general
      </Text>
    </Align>
  ),
};

export const IconText: Story = {
  render: (props) => (
    <Align {...props}>
      <IconDomain />
      <Text>comms.rebellion.org</Text>
    </Align>
  ),
};

export const TextContextualHelp: Story = {
  render: (props) => (
    <Align {...props}>
      <Text>Price</Text>

      <ContextualHelpTrigger>
        <Button color="secondary" />

        <ContextualHelp>
          <Heading>Price Information</Heading>
          <Text>This prices are not final and may change.</Text>
        </ContextualHelp>
      </ContextualHelpTrigger>
    </Align>
  ),
};

export const TextCopyButton: Story = {
  render: (props) => (
    <Align {...props}>
      <Text>comms.rebellion.org</Text>
      <CopyButton text="comms.rebellion.org" />
    </Align>
  ),
};
