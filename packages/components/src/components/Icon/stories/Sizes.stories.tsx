import type { Meta, StoryObj } from "@storybook/react";
import Icon from "@/components/Icon/Icon";
import React from "react";
import defaultMeta from "./Default.stories";

const meta: Meta<typeof Icon> = {
  ...defaultMeta,
  title: "Content/Icon/Sizes",
  args: { "aria-label": "home" },
  render: (props) => <Icon {...props} name="home" />,
};
export default meta;

type Story = StoryObj<typeof Icon>;

export const Small: Story = {
  args: { size: "s" },
};

export const Medium: Story = {
  args: { size: "m" },
};

export const Large: Story = {
  args: { size: "l" },
};
