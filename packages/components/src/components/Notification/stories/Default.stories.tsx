import type { Meta, StoryObj } from "@storybook/react";
import Notification from "../index";
import React from "react";
import { Button } from "@/components/Button";
import { NotificationProvider } from "../components/NotificationProvider";

const meta: Meta<typeof Notification> = {
  title: "Status/Notification",
  component: Notification,
  render: () => (
    <NotificationProvider>
      {(state) => (
        <Button
          onPress={() =>
            state.add(
              {
                content: "content",
                title: "title",
              },
              { timeout: 10000 },
            )
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

export const Default: Story = {};
