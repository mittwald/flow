import type { Meta, StoryObj } from "@storybook/react";
import Action from "../Action";
import React from "react";
import {
  asyncAction,
  syncAction,
  trigger,
} from "@/components/Button/stories/lib";

const meta: Meta<typeof Action> = {
  title: "Actions/Action",
  component: Action,
  render: (props) => <Action {...props} />,
  args: {
    action: syncAction,
    children: trigger,
  },
};

export default meta;

type Story = StoryObj<typeof Action>;

export const Default: Story = {};

export const Async: Story = {
  args: {
    action: asyncAction,
  },
};

export const AsyncWithFeedback: Story = {
  args: {
    action: asyncAction,
    feedback: true,
  },
};

export const Nested: Story = {
  args: {
    children: <Action action={syncAction}>{trigger}</Action>,
  },
};

export const NestedAsync: Story = {
  args: {
    action: asyncAction,
    children: <Action action={asyncAction}>{trigger}</Action>,
  },
};
