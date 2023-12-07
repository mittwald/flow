import type { Meta, StoryObj } from "@storybook/react";
import Button from "../Button";

const meta: Meta<typeof Button> = {
  title: "Button",
  component: Button,
  args: {
    children: "Button",
  },
};

export default meta;

type Story = StoryObj<typeof Button>;

export const Default: Story = {};

export const Disabled: Story = {
  args: {
    isDisabled: true,
  },
};
