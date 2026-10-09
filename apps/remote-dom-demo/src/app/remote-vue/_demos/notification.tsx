/** @jsxImportSource @/app/remote-vue/_lib */
import {
  Button,
  Flex,
  Notification,
  NotificationProvider,
  Text,
  useNotificationController,
} from "@mittwald/flow-remote-vue-components";
import { defineComponent } from "vue";

const Transmissions = defineComponent({
  name: "Transmissions",
  setup() {
    const notifications = useNotificationController();
    let lastId: number | undefined;

    const send = () => {
      lastId = notifications.add(
        <Notification autoClose onClick={() => console.log("Clicked")}>
          <Text>Transmission received from Rebel command</Text>
        </Notification>,
      );
    };

    const dismissAll = () => {
      if (lastId === undefined) {
        return;
      }
      for (let id = 0; id <= lastId; id++) {
        notifications.remove(id);
      }
    };

    return () => (
      <Flex columnGap="s">
        <Button onPress={send}>Send transmission</Button>
        <Button onPress={dismissAll}>Dismiss all</Button>
      </Flex>
    );
  },
});

/**
 * The Vue counterpart of `/remote/notification`.
 *
 * The provider is this package's Vue rebuild: the notifications live in a
 * reactive list in the extension, and the host renders them in its own
 * container.
 */
export const NotificationDemo = defineComponent({
  name: "NotificationDemo",
  setup: () => () => (
    <NotificationProvider>
      <Transmissions />
    </NotificationProvider>
  ),
});
