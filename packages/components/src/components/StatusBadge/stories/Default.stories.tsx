import type { Meta, StoryObj } from "@storybook/react";
import StatusBadge from "../StatusBadge";
import React from "react";

const meta: Meta<typeof StatusBadge> = {
  title: "Status/StatusBadge",
  component: StatusBadge,
  argTypes: {
    status: {
      control: "inline-radio",
    },
  },
  parameters: {
    controls: { exclude: ["className"] },
  },
  render: (props) => <StatusBadge {...props}>Info</StatusBadge>,
};
export default meta;

type Story = StoryObj<typeof StatusBadge>;

export const Default: Story = {};

export const IconOnly: Story = {
  render: (props) => <StatusBadge {...props} />,
};
