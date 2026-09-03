import type { Meta, StoryObj } from "@storybook/react";
import { useEffect } from "react";
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
  parameters: {
    controls: { disable: true },
  },
  render: (props) => {
    const notificationController = useNotificationController();

    useEffect(() => {
      setTimeout(() => {
        notificationController.add(
          <Notification
            autoClose={props.autoClose}
            onClick={() => alert("Notification clicked")}
          >
            <Heading>Transmission received</Heading>
            <Text>
              A message from leia.organa@rebellion.org has reached the Rebel
              base.
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
            <Heading>Shields offline</Heading>
            <Text>Deflector shields could not be raised on Hoth.</Text>
          </Notification>,
        );
      }, 2000);
    }, []);

    return <Text>Transmissions incoming...</Text>;
  },
};

export default meta;

type Story = StoryObj<{ autoClose: boolean }>;

export const Incoming: Story = {};

export const WithAutoClose: Story = { args: { autoClose: true } };
