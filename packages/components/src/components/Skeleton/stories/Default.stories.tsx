import type { Meta, StoryObj } from "@storybook/react";
import Skeleton from "../Skeleton";
import React from "react";

const meta: Meta<typeof Skeleton> = {
  title: "Content/Skeleton",
  component: Skeleton,
  render: (props) => <Skeleton {...props} />,
  parameters: {
    controls: { exclude: ["className", "width", "height"] },
  },
};
export default meta;

type Story = StoryObj<typeof Skeleton>;

export const Default: Story = {};

export const OnDarkBackground: Story = {
  globals: {
    backgrounds: "dark",
  },
};

export const WithCustomSize: Story = {
  render: (props) => <Skeleton {...props} height={200} width={200} />,
};
