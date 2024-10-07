import type { Meta, StoryObj } from "@storybook/react";
import AlertIcon from "../AlertIcon";

const meta: Meta<typeof AlertIcon> = {
  title: "Status/AlertIcon",
  component: AlertIcon,
  parameters: {
    controls: { exclude: ["render", "tunnelId"] },
  },
  argTypes: {
    size: {
      control: "inline-radio",
      options: ["s", "m", "l"],
    },
    status: {
      control: "inline-radio",
      options: ["info", "success", "warning", "danger"],
    },
  },
  args: {
    size: "m",
    status: "info",
  },
};

export default meta;

type Story = StoryObj<typeof AlertIcon>;

export const Info: Story = {
  args: { status: "info" },
};

export const Success: Story = {
  args: { status: "success" },
};

export const Warning: Story = {
  args: { status: "warning" },
};

export const Danger: Story = {
  args: { status: "danger" },
};
