import type { ComponentProps, FC } from "react";
import React from "react";
import ReactDOM from "react-dom";
import clsx from "clsx";
import styles from "./NotificationProvider.module.scss";
import type NotificationController from "@/components/NotificationProvider/NotificationController";
import ControlledNotification from "@/components/NotificationProvider/ControlledNotification";

export interface NotificationsContainerProps extends ComponentProps<"div"> {
  controller: NotificationController;
}

export const NotificationsContainer: FC<NotificationsContainerProps> = (
  props,
) => {
  const { className, controller, ...rest } = props;

  const rootClassName = clsx(styles.notificationProvider, className);

  const notifications = controller.useNotificationsStream();

  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => setMounted(true), []);

  const content = (
    <div className={rootClassName} {...rest}>
      {notifications.map((n) => (
        <ControlledNotification
          key={n.meta.id}
          notification={n}
          controller={controller}
        />
      ))}
    </div>
  );

  return mounted ? ReactDOM.createPortal(content, document.body) : null;
};

export default NotificationsContainer;
