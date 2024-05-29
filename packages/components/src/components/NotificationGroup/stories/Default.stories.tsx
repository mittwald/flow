import type { Meta, StoryObj } from "@storybook/react";
import type { ReactNode } from "react";
import { useEffect } from "react";
import React, { useState } from "react";
import { Heading } from "@/components/Heading";
import type { Notification } from "@/components/Notification";
import { Text } from "@/components/Text";
import { NotificationGroup } from "@/components/NotificationGroup";
import type { Status } from "@/lib/types/props";
import type { NotificationData } from "@/components/NotificationGroup/NotificationController";
import { NotificationController } from "@/components/NotificationGroup/NotificationController";

const meta: Meta<typeof NotificationGroup> = {
  title: "Status/NotificationGroup",
  component: NotificationGroup,
  render: (props) => {
    const notificationController = NotificationController.useNew();

    useEffect(() => {
      setTimeout(() => {
        notificationController.add({
          id: "1",
          heading: "Email address archived",
          text: "Your email address example@mittwald.de has been archived.",
          onClick: () => alert("1"),
        });
      }, 5000);

      setTimeout(() => {
        notificationController.add({
          id: "2",
          heading: "No SSL certificate",
          text: "No SSL certificate could be issued for example.de.",
          status: "warning",
          onClick: () => alert("2"),
        });
      }, 10000);
    }, []);

    return <NotificationGroup controller={notificationController} />;
  },
};

export default meta;

type Story = StoryObj<typeof Notification>;

export const Default: Story = {};
