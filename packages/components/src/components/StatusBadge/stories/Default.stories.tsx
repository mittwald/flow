import type { Meta, StoryObj } from "@storybook/react";
import StatusBadge from "../StatusBadge";
import React from "react";

const meta: Meta<typeof StatusBadge> = {
  title: "Status/StatusBadge",
  component: StatusBadge,

  parameters: {
    controls: { exclude: ["className"] },
  },
  args: { status: "info" },
  argTypes: {
    status: {
      control: "inline-radio",
      options: ["info", "success", "warning", "danger"],
    },
  },
  render: (props) => <StatusBadge {...props}>Info</StatusBadge>,
};
export default meta;

type Story = StoryObj<typeof StatusBadge>;

export const Default: Story = {};

export const IconOnly: Story = {
  render: (props) => <StatusBadge {...props} />,
};
