import type { Meta, StoryObj } from "@storybook/react";
import StatusBadge from "../StatusBadge";
import defaultMeta from "./Default.stories";
import React from "react";

const meta: Meta<typeof StatusBadge> = {
  ...defaultMeta,
  title: "Status/StatusBadge/Status",
};
export default meta;

type Story = StoryObj<typeof StatusBadge>;

export const Info: Story = {};

export const Success: Story = {
  render: (props) => <StatusBadge {...props}>Success</StatusBadge>,
  args: {
    status: "success",
  },
};

export const Warning: Story = {
  render: (props) => <StatusBadge {...props}>Warning</StatusBadge>,
  args: {
    status: "warning",
  },
};

export const Danger: Story = {
  render: (props) => <StatusBadge {...props}>Danger</StatusBadge>,
  args: {
    status: "danger",
  },
};
