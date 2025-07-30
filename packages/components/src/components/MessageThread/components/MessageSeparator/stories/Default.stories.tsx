import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import {
  ContextualHelp,
  ContextualHelpTrigger,
} from "@/components/ContextualHelp";
import { Button } from "@/components/Button";
import { Text } from "@/components/Text";
import { Align } from "@/components/Align";
import { MessageSeparator } from "@/components/MessageThread";

const meta: Meta<typeof MessageSeparator> = {
  title: "Chat/MessageSeparator",
  component: MessageSeparator,
  render: (props) => (
    <MessageSeparator {...props}>Conversation created</MessageSeparator>
  ),
};
export default meta;

type Story = StoryObj<typeof MessageSeparator>;

export const Default: Story = {};
export const WithContextualHelp: Story = {
  render: (props) => (
    <MessageSeparator {...props}>
      <Align>
        <Text>Conversation created</Text>
        <ContextualHelpTrigger>
          <Button />
          <ContextualHelp>Conversation created by John Doe</ContextualHelp>
        </ContextualHelpTrigger>
      </Align>
    </MessageSeparator>
  ),
};
