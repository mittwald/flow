import type { Meta, StoryObj } from "@storybook/react";
import Skeleton from "../Skeleton";
import React from "react";
import { storyBackgroundDark } from "@/lib/dev/storyBackgrounds";

const meta: Meta<typeof Skeleton> = {
  title: "Content/Skeleton",
  component: Skeleton,
  render: (props) => <Skeleton {...props} />,
  parameters: {
    controls: { exclude: ["className"] },
  },
};
export default meta;

type Story = StoryObj<typeof Skeleton>;

export const Default: Story = {};

export const OnDarkBackground: Story = {
  parameters: {
    backgrounds: storyBackgroundDark,
  },
};

export const WithCustomSize: Story = {
  render: (props) => <Skeleton {...props} style={{ height: "200px" }} />,
};

export const WithCustomBorderRadius: Story = {
  render: (props) => (
    <Skeleton
      {...props}
      style={{ borderRadius: "20px", height: "30px", width: "60px" }}
    />
  ),
};
