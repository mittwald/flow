import type { Meta, StoryObj } from "@storybook/react";
import React, { useEffect } from "react";
import {
  NotificationProvider,
  useNotificationController,
} from "@/components/NotificationProvider";
import { Text } from "@/components/Text";
import { Notification } from "@/components/Notification";
import { Heading } from "@/components/Heading";

const meta: Meta<{ autoClose: boolean }> = {
  title: "Status/Notification",
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
        notificationController.add(
          <Notification
            autoClose={props.autoClose}
            onClick={() => alert("Notification clicked")}
          >
            <Heading>Email address archived</Heading>
            <Text>
              Your email address examples@mittwald.de has been archived.
            </Text>
          </Notification>,
        );
      }, 500);

      setTimeout(() => {
        notificationController.add(
          <Notification
            autoClose={props.autoClose}
            onClick={() => alert("Notification clicked")}
            status="warning"
          >
            <Heading>No SSL certificate</Heading>
            <Text>No SSL certificate could be issued for examples.de.</Text>
          </Notification>,
        );
      }, 2000);
    }, []);

    return <Text>Notifications incoming...</Text>;
  },
};

export default meta;

type Story = StoryObj<{ autoClose: boolean }>;

export const Incoming: Story = {};

export const WithAutoClose: Story = { args: { autoClose: true } };
