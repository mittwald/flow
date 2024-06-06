import type { ComponentProps, FC } from "react";
import React from "react";
import ReactDOM from "react-dom";
import clsx from "clsx";
import styles from "./NotificationContainer.module.scss";
import type NotificationController from "@/components/NotificationProvider/NotificationController";
import ControlledNotification from "@/components/NotificationProvider/ControlledNotification";
import { AnimatePresence, domAnimation, LazyMotion, m } from "framer-motion";
import { useIsSSR } from "react-aria";

export interface NotificationsContainerProps extends ComponentProps<"div"> {
  controller: NotificationController;
}

export const NotificationsContainer: FC<NotificationsContainerProps> = (
  props,
) => {
  const { className, controller, ...rest } = props;

  const rootClassName = clsx(styles.notificationContainer, className);

  const notifications = controller.useNotifications();

  const isSsr = useIsSSR();

  const content = (
    <LazyMotion features={domAnimation}>
      <div className={rootClassName} {...rest}>
        <AnimatePresence>
          {notifications.map((n) => (
            <m.div
              className={styles.notification}
              key={n.meta.id}
              initial={{ opacity: 0, x: 200 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 200, height: 0, paddingBottom: 0 }}
              transition={{
                bounce: 0,
              }}
            >
              <ControlledNotification
                notification={n}
                controller={controller}
              />
            </m.div>
          ))}
        </AnimatePresence>
      </div>
    </LazyMotion>
  );

  return isSsr ? null : ReactDOM.createPortal(content, document.body);
};

export default NotificationsContainer;
