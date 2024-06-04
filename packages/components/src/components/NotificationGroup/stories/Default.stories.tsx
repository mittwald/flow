import type { Meta, StoryObj } from "@storybook/react";
import React, { useEffect } from "react";
import type { Notification } from "@/components/Notification";
import { NotificationGroup } from "@/components/NotificationGroup";
import { NotificationController } from "@/components/NotificationGroup/NotificationController";

const meta: Meta<typeof NotificationGroup> = {
  title: "Status/NotificationGroup",
  component: NotificationGroup,
  render: (props) => {
    const notificationController = NotificationController.useNew();

    useEffect(() => {
      setTimeout(() => {
        notificationController.add({
          heading: "Email address archived",
          text: "Your email address examples@mittwald.de has been archived.",
          onClick: () => alert("Notification clicked"),
        });
      }, 5000);

      setTimeout(() => {
        notificationController.add({
          heading: "No SSL certificate",
          text: "No SSL certificate could be issued for examples.de.",
          status: "warning",
          onClick: () => alert("Notification clicked"),
        });
      }, 10000);
    }, []);

    return <NotificationGroup {...props} controller={notificationController} />;
  },
};

export default meta;

type Story = StoryObj<typeof Notification>;

export const Default: Story = {};

export const WithAutoClose: Story = { args: { autoClose: true } };
