import type { FC } from "react";
import { cloneElement } from "react";
import type {
  NotificationController,
  NotificationData,
} from "@/components/NotificationProvider/NotificationController";

interface Props {
  notification: NotificationData;
  controller: NotificationController;
}

export const ControlledNotification: FC<Props> = (props) => {
  const { notification, controller } = props;

  return cloneElement(notification.element, {
    onMouseEnter: () => {
      if (notification.element.props.autoClose) {
        notification.meta.autoCloseTimer.pause();
      }
    },
    onMouseLeave: () => {
      if (notification.element.props.autoClose) {
        notification.meta.autoCloseTimer.resume();
      }
    },
    onClose: () => {
      controller.remove(notification.meta.id);
      notification.element.props.onClose?.();
    },
    onFocus: () => {
      if (notification.element.props.autoClose) {
        notification.meta.autoCloseTimer.pause();
      }
    },
    onBlur: () => {
      if (notification.element.props.autoClose) {
        notification.meta.autoCloseTimer.resume();
      }
    },
  });
};

export default ControlledNotification;
