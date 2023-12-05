import type { Meta, StoryObj } from "@storybook/react";
import Button from "./Button";

const meta: Meta<typeof Button> = {
  component: Button,
  args: {
    children: "Button",
  },
};
export default meta;

type Story = StoryObj<typeof Button>;

export const Accent: Story = {
  args: {
    variant: "accent",
  },
};

export const Primary: Story = {
  args: {
    variant: "primary",
  },
};

export const Secondary: Story = {
  args: {
    variant: "secondary",
  },
};

export const Negative: Story = {
  args: {
    variant: "negative",
  },
};

export const Disabled: Story = {
  args: {
    isDisabled: true,
  },
};
