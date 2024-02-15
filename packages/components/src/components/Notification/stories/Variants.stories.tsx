import type { Meta, StoryObj } from "@storybook/react";
import Notification from "../index";
import React, { FC } from "react";
import { Button } from "@/components/Button";
import { NotificationProvider } from "../components/NotificationProvider";
import { NotificationContentProps } from "@/components/Notification/Notification";
import defaultMeta from "./Default.stories";

const meta: Meta<typeof Notification> = {
  ...defaultMeta,
  title: "Overlays/Notification/Variants",
  component: Notification,
  render: () => (
    <NotificationProvider>
      {(state) => (
        <Button
          onPress={() =>
            state.add({
              content: "content",
              title: "title",
            })
          }
        >
          Show notification
        </Button>
      )}
    </NotificationProvider>
  ),
};
export default meta;

type Story = StoryObj<typeof Notification>;

const DemoNotification: FC<{ content: NotificationContentProps }> = (props) => {
  return (
    <Notification
      key="a"
      toast={{
        content: props.content,
        key: "a",
      }}
      state={{
        add: () => "",
        close: () => {},
        pauseAll: () => {},
        remove: () => {},
        resumeAll: () => {},
        visibleToasts: [],
      }}
    />
  );
};

export const a: Story = {
  render: () => (
    <DemoNotification
      content={{
        content: "content",
        title: "title",
      }}
    />
  ),
};
