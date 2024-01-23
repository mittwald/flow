import type { Meta, StoryObj } from "@storybook/react";
import Badge from "../Badge";
import defaultMeta from "./Default.stories";
import React from "react";

const meta: Meta<typeof Badge> = {
  ...defaultMeta,
  title: "Status/Badge/Variants",
};
export default meta;

type Story = StoryObj<typeof Badge>;

export const Info: Story = {};

export const Success: Story = {
  render: (props) => (
    <Badge variant="success" {...props}>
      Success
    </Badge>
  ),
};

export const Warning: Story = {
  render: (props) => (
    <Badge variant="warning" {...props}>
      Warning
    </Badge>
  ),
};

export const Negative: Story = {
  render: (props) => (
    <Badge variant="negative" {...props}>
      Negative
    </Badge>
  ),
};
