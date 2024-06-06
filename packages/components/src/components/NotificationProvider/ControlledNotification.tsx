import type { FC } from "react";
import React from "react";
import type {
  NotificationController,
  NotificationData,
} from "@/components/NotificationProvider/NotificationController";
import { Notification } from "@/components/Notification";
import { Heading } from "@/components/Heading";
import { Text } from "@/components/Text";

interface Props {
  notification: NotificationData;
  controller: NotificationController;
}

export const ControlledNotification: FC<Props> = (props) => {
  const { notification, controller } = props;

  return (
    <Notification
      onClose={() => controller.remove(notification.meta.id)}
      onClick={notification.onClick}
      onMouseEnter={() => {
        notification.meta.autoCloseTimer.pause();
      }}
      onMouseLeave={() => {
        notification.meta.autoCloseTimer.resume();
      }}
      status={notification.status}
    >
      <Heading>{notification.heading}</Heading>
      <Text>{notification.text} </Text>
    </Notification>
  );
};

export default ControlledNotification;
