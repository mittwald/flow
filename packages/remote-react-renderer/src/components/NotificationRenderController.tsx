import {
  useNotificationController,
  type NotificationProps,
  Notification,
} from "@mittwald/flow-react-components";
import { useEffect, useRef, type FC } from "react";

export const NotificationRenderController: FC<NotificationProps> = (props) => {
  const notifications = useNotificationController();
  const isAdded = useRef(false);

  useEffect(() => {
    if (isAdded.current) {
      return;
    }

    const id = notifications.add(<Notification {...props} />);
    isAdded.current = true;

    return () => {
      notifications.remove(id);
      isAdded.current = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- add the notification once; later props do not update it
  }, [notifications]);

  return null;
};
