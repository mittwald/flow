import type { ComponentProps, FC } from "react";
import React from "react";
import ReactDOM from "react-dom";
import clsx from "clsx";
import styles from "./NotificationProvider.module.scss";
import type NotificationController from "@/components/NotificationProvider/NotificationController";
import { Notification } from "@/components/Notification";
import { Heading } from "@/components/Heading";
import { Text } from "@/components/Text";

export interface NotificationProviderProps extends ComponentProps<"div"> {
  controller: NotificationController;
  autoClose?: boolean;
}

export const NotificationProvider: FC<NotificationProviderProps> = (props) => {
  const { className, controller, autoClose, ...rest } = props;

  const rootClassName = clsx(styles.notificationProvider, className);

  const notifications = controller.useNotificationList();

  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => setMounted(true), []);

  const content = (
    <div className={rootClassName} {...rest}>
      {notifications.map((n) => (
        <Notification
          className={styles.notification}
          onClose={() => controller.remove(n.id)}
          onClick={n.onClick}
          status={n.status}
          key={n.id}
          autoClose={n.autoClose ?? autoClose}
        >
          <Heading>{n.heading}</Heading>
          <Text>{n.text} </Text>
        </Notification>
      ))}
    </div>
  );

  return mounted ? ReactDOM.createPortal(content, document.body) : null;
};

export default NotificationProvider;
