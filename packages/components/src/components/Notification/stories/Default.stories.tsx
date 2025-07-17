import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { Heading } from "@/components/Heading";
import { Notification } from "@/components/Notification";
import { Text } from "@/components/Text";
import { action } from "storybook/actions";

const meta: Meta<typeof Notification> = {
  title: "Status/Notifications/Notification",
  component: Notification,

  argTypes: {
    status: {
      control: "inline-radio",
      options: ["info", "success", "warning", "danger"],
    },
  },
  args: {
    status: "info",
    onClick: action("onClick"),
    onClose: action("onClose"),
  },

  render: (props) => (
    <Notification {...props}>
      <Heading>Email address archived</Heading>
      <Text>
        Your email address <b>example@mittwald.de</b> has been archived.
      </Text>
    </Notification>
  ),
};

export default meta;

type Story = StoryObj<typeof Notification>;

export const Default: Story = {};

export const WithoutLink: Story = {
  args: { onClick: undefined, onClose: undefined },
};
