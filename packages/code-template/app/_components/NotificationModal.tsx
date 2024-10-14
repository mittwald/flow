import Heading from "@mittwald/flow-react-components/Heading";
import { ListItemView, typedList } from "@mittwald/flow-react-components/List";
import Modal from "@mittwald/flow-react-components/Modal";
import Text from "@mittwald/flow-react-components/Text";
import type { FC } from "react";
import { Content } from "@mittwald/flow-react-components/Content";
import Avatar from "@mittwald/flow-react-components/Avatar";
import { IconNotification } from "@mittwald/flow-react-components/Icons";
import type { Notification } from "@/api/notificationApi";
import { listNotifications } from "@/api/notificationApi";

export const NotificationModal: FC = () => {
  const NotificationList = typedList<Notification>();
  const notifications = listNotifications();

  return (
    <Modal offCanvas>
      <Heading>Benachrichtigungen</Heading>
      <Content>
        <NotificationList.List>
          <NotificationList.StaticData data={notifications} />

          <NotificationList.Item href={(notification) => notification.href}>
            {(notification) => (
              <ListItemView>
                <Avatar color="blue">
                  <IconNotification />
                </Avatar>
                <Heading>{notification.title}</Heading>
                <Text>{notification.date}</Text>
              </ListItemView>
            )}
          </NotificationList.Item>
        </NotificationList.List>
      </Content>
    </Modal>
  );
};
