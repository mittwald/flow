import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import LoadingSpinner from "@/components/LoadingSpinner/LoadingSpinner";

const meta: Meta<typeof LoadingSpinner> = {
  title: "Status/LoadingSpinner",
  component: LoadingSpinner,
  render: (props) => <LoadingSpinner {...props} />,
  parameters: {
    controls: { exclude: ["render", "tunnelId"] },
  },
  argTypes: {
    size: {
      control: "inline-radio",
      options: ["s", "m", "l"],
    },
  },
  args: {
    size: "m",
  },
};
export default meta;

type Story = StoryObj<typeof LoadingSpinner>;

export const Default: Story = {};

export const Dark: Story = {
  args: {
    color: "dark",
  },
  globals: {
    backgrounds: "light",
  },
};

export const Light: Story = {
  args: {
    color: "light",
  },
  globals: {
    backgrounds: "dark",
  },
};
