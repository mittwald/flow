import type { Meta, StoryObj } from "@storybook/react";
import ActionStateIcon from "../ActionStateIcon";

const meta: Meta<typeof ActionStateIcon> = {
  title: "Status/ActionStateIcon",
  component: ActionStateIcon,
  parameters: {
    controls: { exclude: ["className"] },
  },
};

export default meta;

type Story = StoryObj<typeof ActionStateIcon>;

export const Pending: Story = {
  args: { isPending: true },
};

export const Succeeded: Story = {
  args: { isSucceeded: true },
};

export const Warning: Story = {
  args: { isFailed: true },
};
