"use client";

import {
  Button,
  Flex,
  Notification,
  Text,
  useNotificationController,
} from "@mittwald/flow-remote-react-components";
import { useRef } from "react";

export default function Page() {
  const notifications = useNotificationController();
  const lastId = useRef<number>(undefined);

  return (
    <Flex columnGap="s">
      <Button
        onPress={() => {
          lastId.current = notifications.add(
            <Notification
              autoClose
              onClick={() => {
                console.log("Clicked");
              }}
            >
              <Text>Remote notification</Text>
            </Notification>,
          );
        }}
      >
        Trigger
      </Button>
      <Button
        onPress={() => {
          if (lastId.current === undefined) {
            return;
          }
          for (let i = 0; i <= lastId.current; i++) {
            notifications.remove(i);
          }
        }}
      >
        Close all
      </Button>
    </Flex>
  );
}
