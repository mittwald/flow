import type { Meta, StoryObj } from "@storybook/react";
import Toast from "../index";
import React from "react";
import { Button } from "@/components/Button";
import { ToastProvider } from "@/components/Toast/components/ToastProvider";

const meta: Meta<typeof Toast> = {
  title: "Overlays/Toast",
  component: Toast,
  render: () => (
    <ToastProvider>
      {(state) => (
        <Button
          onPress={() =>
            state.add({
              content: "content",
              title: "title",
              variant: "warning",
            })
          }
        >
          Show toast
        </Button>
      )}
    </ToastProvider>
  ),
};
export default meta;

type Story = StoryObj<typeof Toast>;

export const Default: Story = {};
