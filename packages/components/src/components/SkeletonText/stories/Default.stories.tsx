import type { Meta, StoryObj } from "@storybook/react";
import SkeletonText from "../SkeletonText";
import React from "react";
import { storyBackgroundDark } from "@/lib/dev/storyBackgrounds";

const meta: Meta<typeof SkeletonText> = {
  title: "Content/SkeletonText",
  component: SkeletonText,
  render: (props) => <SkeletonText {...props} />,
  parameters: {
    controls: { exclude: ["className"] },
  },
};

export default meta;

type Story = StoryObj<typeof SkeletonText>;

export const Default: Story = {};

export const OnDarkBackground: Story = {
  parameters: {
    backgrounds: storyBackgroundDark,
  },
};

export const WithWidth: Story = {
  render: (props) => <SkeletonText {...props} width="200px" />,
};
