import { useNotificationController } from "@mittwald/flow-react-components";
import { ControlledNotification } from "@mittwald/flow-react-components/internal";
import { type FC } from "react";

export const NotificationContainer: FC = () => {
  const controller = useNotificationController();
  const notifications = controller.useNotifications();

  return notifications.map((notification) => {
    return (
      <ControlledNotification
        key={notification.meta.id}
        controller={controller}
        notification={notification}
      />
    );
  });
};
