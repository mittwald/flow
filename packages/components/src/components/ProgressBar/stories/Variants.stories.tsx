import type { Meta, StoryObj } from "@storybook/react";
import ProgressBar from "../ProgressBar";
import defaultMeta from "./Default.stories";

const meta: Meta<typeof ProgressBar> = {
  ...defaultMeta,
  title: "Status/Progress Bar/Variants",
};

export default meta;

type Story = StoryObj<typeof ProgressBar>;

export const Info: Story = {
  args: {
    status: "info",
  },
};

export const Success: Story = {
  args: {
    status: "success",
  },
};

export const Warning: Story = {
  args: {
    status: "warning",
    value: 800,
  },
};

export const Danger: Story = {
  args: {
    status: "danger",
    value: 950,
  },
};
