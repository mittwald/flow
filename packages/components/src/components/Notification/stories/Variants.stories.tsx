import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { Heading } from "@/components/Heading";
import defaultMeta from "./Default.stories";
import { Notification } from "@/components/Notification";
import { Text } from "@/components/Text";

const meta: Meta<typeof Notification> = {
  ...defaultMeta,
  title: "Status/Notifications/Notification/Status",
};

export default meta;

type Story = StoryObj<typeof Notification>;

export const Info: Story = {};

export const Warning: Story = {
  args: { status: "warning" },
  render: (props) => (
    <Notification {...props}>
      <Heading>Storage almost exceeded</Heading>
      <Text>
        The storage in your project <b>My Project</b> is over 80% utilized.
      </Text>
    </Notification>
  ),
};

export const Danger: Story = {
  args: { status: "danger" },
  render: (props) => (
    <Notification {...props}>
      <Heading>No SSL certificate</Heading>
      <Text>
        No SSL certificate could be issued for <b>example.de</b>.
      </Text>
    </Notification>
  ),
};

export const Success: Story = {
  args: { status: "success" },
  render: (props) => (
    <Notification {...props}>
      <Heading>App installation finished</Heading>
      <Text>
        Your app <b>My WordPress</b> has been installed.
      </Text>
    </Notification>
  ),
};
