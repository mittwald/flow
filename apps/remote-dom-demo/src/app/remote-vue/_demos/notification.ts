import {
  Button,
  Flex,
  Notification,
  NotificationProvider,
  Text,
  useNotificationController,
} from "@mittwald/flow-remote-vue-components";
import { defineComponent, h } from "vue";

const Transmissions = defineComponent({
  name: "Transmissions",
  setup() {
    const notifications = useNotificationController();
    let lastId: number | undefined;

    return () =>
      h(Flex, { columnGap: "s" }, () => [
        h(
          Button,
          {
            onPress: () => {
              lastId = notifications.add(
                h(
                  Notification,
                  {
                    autoClose: true,
                    onClick: () => console.log("Clicked"),
                  },
                  () =>
                    h(
                      Text,
                      null,
                      () => "Transmission received from Rebel command",
                    ),
                ),
              );
            },
          },
          () => "Send transmission",
        ),
        h(
          Button,
          {
            onPress: () => {
              if (lastId === undefined) {
                return;
              }
              for (let id = 0; id <= lastId; id++) {
                notifications.remove(id);
              }
            },
          },
          () => "Dismiss all",
        ),
      ]);
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
  setup: () => () => h(NotificationProvider, null, () => h(Transmissions)),
});
