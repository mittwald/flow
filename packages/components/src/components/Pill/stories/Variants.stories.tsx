import type { Meta, StoryObj } from "@storybook/react";
import Pill from "../Pill";
import defaultMeta from "./Default.stories";
import React from "react";

const meta: Meta<typeof Pill> = {
  ...defaultMeta,
  title: "Pill/Variants",
};
export default meta;

type Story = StoryObj<typeof Pill>;

export const Info: Story = {};

export const Success: Story = {
  render: (props) => (
    <Pill variant="success" {...props}>
      Success
    </Pill>
  ),
};

export const Warning: Story = {
  render: (props) => (
    <Pill variant="warning" {...props}>
      Warning
    </Pill>
  ),
};

export const Negative: Story = {
  render: (props) => (
    <Pill variant="negative" {...props}>
      Negative
    </Pill>
  ),
};
