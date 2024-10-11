import Heading from "@mittwald/flow-react-components/Heading";
import { ListItemView, typedList } from "@mittwald/flow-react-components/List";
import Modal from "@mittwald/flow-react-components/Modal";
import Text from "@mittwald/flow-react-components/Text";
import type { FC } from "react";
import { Content } from "@mittwald/flow-react-components/Content";
import Avatar from "@mittwald/flow-react-components/Avatar";
import { IconNotification } from "@mittwald/flow-react-components/Icons";

export const NotificationModal: FC = () => {
  const NotificationList = typedList<{ title: string; date: string }>();

  return (
    <Modal offCanvas>
      <Heading>Benachrichtigungen</Heading>
      <Content>
        <NotificationList.List>
          <NotificationList.StaticData
            data={[
              {
                title: "Speicherplatz fast voll",
                date: "13.09.2024, 07:15 Uhr",
              },
              {
                title: "Projekt erfolgreich angelegt",
                date: "01.09.2024, 15:52 Uhr",
              },
              {
                title: "Organisation erfolgreich angelegt",
                date: "30.08.2024, 12:28 Uhr",
              },
            ]}
          />

          <NotificationList.Item>
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
