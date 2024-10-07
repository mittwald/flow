import type { Meta, StoryObj } from "@storybook/react";
import AlertBadge from "../AlertBadge";
import defaultMeta from "./Default.stories";
import React from "react";

const meta: Meta<typeof AlertBadge> = {
  ...defaultMeta,
  title: "Status/AlertBadge/Status",
};
export default meta;

type Story = StoryObj<typeof AlertBadge>;

export const Info: Story = {};

export const Success: Story = {
  render: (props) => <AlertBadge {...props}>Success</AlertBadge>,
  args: {
    status: "success",
  },
};

export const Warning: Story = {
  render: (props) => <AlertBadge {...props}>Warning</AlertBadge>,
  args: {
    status: "warning",
  },
};

export const Danger: Story = {
  render: (props) => <AlertBadge {...props}>Danger</AlertBadge>,
  args: {
    status: "danger",
  },
};
