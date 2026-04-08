import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import LoadingSpinner from "@/components/LoadingSpinner/LoadingSpinner";
import { StoryBackground } from "@/lib/dev/StoryBackground";
import { alphaColors } from "@/lib/types/props";

const meta: Meta<typeof LoadingSpinner> = {
  title: "Status/LoadingSpinner",
  component: LoadingSpinner,
  render: (props) => (
    <StoryBackground color={props.color}>
      <LoadingSpinner {...props} />
    </StoryBackground>
  ),
  parameters: {
    controls: { exclude: ["render", "tunnelId"] },
  },
  argTypes: {
    size: {
      control: "inline-radio",
      options: ["s", "m", "l"],
    },
    color: {
      control: "inline-radio",
      options: ["default", ...alphaColors],
    },
  },
  args: {
    size: "m",
    color: "default",
  },
};
export default meta;

type Story = StoryObj<typeof LoadingSpinner>;

export const Default: Story = {};
