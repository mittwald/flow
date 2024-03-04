import type { Meta, StoryObj } from "@storybook/react";
import StatusBadge from "../StatusBadge";
import defaultMeta from "./Default.stories";
import React from "react";

const meta: Meta<typeof StatusBadge> = {
  ...defaultMeta,
  title: "Status/StatusBadge/Variants",
};
export default meta;

type Story = StoryObj<typeof StatusBadge>;

export const Info: Story = {};

export const Success: Story = {
  render: (props) => (
    <StatusBadge variant="success" {...props}>
      Success
    </StatusBadge>
  ),
};

export const Warning: Story = {
  render: (props) => (
    <StatusBadge variant="warning" {...props}>
      Warning
    </StatusBadge>
  ),
};

export const Danger: Story = {
  render: (props) => (
    <StatusBadge variant="danger" {...props}>
      Danger
    </StatusBadge>
  ),
};
