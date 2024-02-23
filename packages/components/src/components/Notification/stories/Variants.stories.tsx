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
      key="example"
      toast={{
        content: props.content,
        key: "examle",
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

export const Info: Story = {
  render: () => (
    <DemoNotification
      content={{
        content: "Your ticket has been closed",
        title: "Ticket closed",
      }}
    />
  ),
};

export const Success: Story = {
  render: () => (
    <DemoNotification
      content={{
        content: "WordPress has been installed successfully",
        title: "App Installed",
        variant: "success",
      }}
    />
  ),
};

export const Warning: Story = {
  render: () => (
    <DemoNotification
      content={{
        content: "Your email address has been deactivated",
        title: "Email deactivated",
        variant: "warning",
      }}
    />
  ),
};

export const Danger: Story = {
  render: () => (
    <DemoNotification
      content={{
        content: "Your project storage is exceeded",
        title: "Storage exceeded",
        variant: "danger",
      }}
    />
  ),
};
