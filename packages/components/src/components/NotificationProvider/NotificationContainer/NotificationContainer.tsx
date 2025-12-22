import type { ComponentProps, FC } from "react";
import { Suspense } from "react";
import ReactDOM from "react-dom";
import clsx from "clsx";
import styles from "./NotificationContainer.module.scss";
import ControlledNotification from "@/components/NotificationProvider/ControlledNotification";
import {
  AnimatePresence,
  domAnimation,
  LazyMotion,
  m,
  MotionConfig,
} from "framer-motion";
import { useIsSSR } from "react-aria";
import { useNotificationController } from "@/components/NotificationProvider/NotificationProvider";

export type NotificationsContainerProps = ComponentProps<"div">;

export const NotificationContainer: FC<NotificationsContainerProps> = (
  props,
) => {
  const { className, ...rest } = props;

  const controller = useNotificationController();
  const notifications = controller.useNotifications();
  const isSsr = useIsSSR();

  const rootClassName = clsx(styles.notificationContainer, className);

  const content = (
    <MotionConfig reducedMotion="user">
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
                <Suspense>
                  <ControlledNotification
                    notification={n}
                    controller={controller}
                  />
                </Suspense>
              </m.div>
            ))}
          </AnimatePresence>
        </div>
      </LazyMotion>
    </MotionConfig>
  );

  return isSsr ? null : ReactDOM.createPortal(content, document.body);
};

export default NotificationContainer;
