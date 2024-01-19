import type { Meta, StoryObj } from "@storybook/react";
import StatusIcon from "../StatusIcon";

const meta: Meta<typeof StatusIcon> = {
  title: "StatusIcon",
  component: StatusIcon,
  argTypes: {
    variant: {
      control: "inline-radio",
    },
  },
  parameters: {
    controls: { exclude: ["className"] },
  },
};

export default meta;

type Story = StoryObj<typeof StatusIcon>;

export const Info: Story = {
  args: { variant: "info" },
};

export const Success: Story = {
  args: { variant: "success" },
};

export const Warning: Story = {
  args: { variant: "warning" },
};

export const Negative: Story = {
  args: { variant: "negative" },
};
