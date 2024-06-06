import type { Meta, StoryObj } from "@storybook/react";
import React, { useEffect } from "react";
import {
  NotificationProvider,
  useNotificationController,
} from "@/components/NotificationProvider";
import { Text } from "@/components/Text";

const meta: Meta<{ autoClose: boolean }> = {
  title: "Status/NotificationProvider",
  decorators: [
    (Story) => (
      <NotificationProvider>
        <Story />
      </NotificationProvider>
    ),
  ],
  render: (props) => {
    const notificationController = useNotificationController();

    useEffect(() => {
      setTimeout(() => {
        notificationController.add({
          autoClose: props.autoClose,
          heading: "Email address archived",
          text: "Your email address examples@mittwald.de has been archived.",
          onClick: () => alert("Notification clicked"),
        });
      }, 500);

      setTimeout(() => {
        notificationController.add({
          autoClose: props.autoClose,
          heading: "No SSL certificate",
          text: "No SSL certificate could be issued for examples.de.",
          status: "warning",
          onClick: () => alert("Notification clicked"),
        });
      }, 2000);
    }, []);

    return <Text>Notifications incoming...</Text>;
  },
};

export default meta;

type Story = StoryObj<{ autoClose: boolean }>;

export const Default: Story = {};

export const WithAutoClose: Story = { args: { autoClose: true } };
