import type { Meta, StoryObj } from "@storybook/react";
import StatusIcon from "../StatusIcon";

const meta: Meta<typeof StatusIcon> = {
  title: "Status/StatusIcon",
  component: StatusIcon,
  argTypes: {
    status: {
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
