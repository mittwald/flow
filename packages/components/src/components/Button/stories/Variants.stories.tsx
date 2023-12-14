import type { Meta, StoryObj } from "@storybook/react";
import Button from "../Button";
import defaultMeta from "./Default.stories";

const meta: Meta<typeof Button> = {
  ...defaultMeta,
  title: "Button/Variants",
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
