import type { ComponentProps, FC } from "react";
import React from "react";
import clsx from "clsx";
import styles from "./NotificationGroup.module.scss";
import type NotificationController from "@/components/NotificationGroup/NotificationController";
import { Notification } from "@/components/Notification";
import { Heading } from "@/components/Heading";
import { Text } from "@/components/Text";

export interface NotificationGroupProps extends ComponentProps<"div"> {
  controller: NotificationController;
  autoClose?: boolean;
}

export const NotificationGroup: FC<NotificationGroupProps> = (props) => {
  const { className, controller, autoClose = true, ...rest } = props;

  const rootClassName = clsx(styles.notificationGroup, className);

  const notifications = controller.useNotificationList();

  return (
    <div className={rootClassName} {...rest}>
      {notifications.map((n) => (
        <Notification
          onClose={() => controller.remove(n.id)}
          onClick={n.onClick}
          status={n.status}
          key={n.id}
          autoClose={autoClose}
        >
          <Heading>{n.heading}</Heading>
          <Text>{n.text} </Text>
        </Notification>
      ))}
    </div>
  );
};

export default NotificationGroup;
