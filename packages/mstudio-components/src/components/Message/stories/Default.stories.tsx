import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { Message } from "@/components/Message";

const meta: Meta<typeof Message> = {
  title: "Message",
  component: Message,
  render: (props) => <Message {...props}>Das ist eine Nachricht</Message>,
};
export default meta;

type Story = StoryObj<typeof Message>;

export const Default: Story = {};
