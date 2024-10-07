import type { Meta, StoryObj } from "@storybook/react";
import AlertBadge from "../AlertBadge";
import React from "react";

const meta: Meta<typeof AlertBadge> = {
  title: "Status/AlertBadge",
  component: AlertBadge,

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
  render: (props) => <AlertBadge {...props}>Info</AlertBadge>,
};
export default meta;

type Story = StoryObj<typeof AlertBadge>;

export const Default: Story = {};
