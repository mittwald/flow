import type { Meta, StoryObj } from "@storybook/react";
import Button from "../Button";
import defaultMeta from "./Default.stories";

const meta: Meta<typeof Button> = {
  ...defaultMeta,
  title: "Buttons/Button/Variants",
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

export const Danger: Story = {
  args: {
    variant: "danger",
  },
};

export const Plain: Story = {
  args: {
    variant: "plain",
  },
};

export const Transparent: Story = {
  args: {
    variant: "transparent",
  },
};
