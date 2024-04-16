import type { Meta, StoryObj } from "@storybook/react";
import Action from "../Action";
import React from "react";
import {
  asyncFunction,
  syncfunction,
  button,
} from "@/components/Button/stories/lib";

const meta: Meta<typeof Action> = {
  title: "Actions/Action",
  component: Action,
  render: (props) => <Action {...props} />,
  args: {
    action: syncfunction,
    children: button,
  },
  parameters: {
    controls: {
      exclude: [
        "children",
        "action",
        "closeModal",
        "openModal",
        "toggleModal",
        "feedback",
      ],
    },
  },
};

export default meta;

type Story = StoryObj<typeof Action>;

export const Default: Story = {};

export const Async: Story = {
  args: {
    action: asyncFunction,
  },
};

export const AsyncWithFeedback: Story = {
  args: {
    action: asyncFunction,
    feedback: true,
  },
};

export const Nested: Story = {
  args: {
    children: <Action action={syncfunction}>{button}</Action>,
  },
};

export const NestedAsync: Story = {
  args: {
    action: asyncFunction,
    children: <Action action={asyncFunction}>{button}</Action>,
  },
};
