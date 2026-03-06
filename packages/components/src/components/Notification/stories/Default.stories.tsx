import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { Heading } from "@/components/Heading";
import { Notification } from "@/components/Notification";
import { Text } from "@/components/Text";
import { action } from "storybook/actions";
import { dummyText } from "@/lib/dev/dummyText";

const meta: Meta<typeof Notification> = {
  title: "Status/Notification",
  component: Notification,
  parameters: {
    controls: { exclude: ["href", "autoClose", "onClick", "onClose"] },
  },
  argTypes: {
    status: {
      control: "inline-radio",
      options: ["info", "success", "warning", "danger"],
    },
  },
  args: { status: "info" },
  render: (props) => (
    <Notification
      {...props}
      onClick={action("onClick")}
      onClose={action("onClose")}
    >
      <Heading>{dummyText.short}</Heading>
      <Text>{dummyText.medium}</Text>
    </Notification>
  ),
};

export default meta;

type Story = StoryObj<typeof Notification>;

export const Default: Story = {};

export const WithoutLink: Story = {
  render: (props) => (
    <Notification {...props}>
      <Heading>{dummyText.short}</Heading>
      <Text>{dummyText.medium}</Text>
    </Notification>
  ),
};
