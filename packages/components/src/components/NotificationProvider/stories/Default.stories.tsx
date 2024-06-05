import type { Meta, StoryObj } from "@storybook/react";
import React, { useEffect } from "react";
import type { Notification } from "@/components/Notification";
import { NotificationProvider } from "@/components/NotificationProvider";
import { NotificationController } from "@/components/NotificationProvider/NotificationController";

const meta: Meta<typeof NotificationProvider> = {
  title: "Status/NotificationProvider",
  component: NotificationProvider,
  render: (props) => {
    const notificationController = NotificationController.useNew();

    useEffect(() => {
      setTimeout(() => {
        notificationController.add({
          heading: "Email address archived",
          text: "Your email address examples@mittwald.de has been archived.",
          onClick: () => alert("Notification clicked"),
        });
      }, 1000);

      setTimeout(() => {
        notificationController.add({
          heading: "No SSL certificate",
          text: "No SSL certificate could be issued for examples.de.",
          status: "warning",
          onClick: () => alert("Notification clicked"),
        });
      }, 3000);
    }, []);

    return (
      <NotificationProvider {...props} controller={notificationController} />
    );
  },
};

export default meta;

type Story = StoryObj<typeof Notification>;

export const Default: Story = {};

export const WithAutoClose: Story = { args: { autoClose: true } };
