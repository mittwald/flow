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
    variant: "info",
  },
};

export const Success: Story = {
  args: {
    variant: "success",
  },
};

export const Warning: Story = {
  args: {
    variant: "warning",
    value: 800,
  },
};

export const Danger: Story = {
  args: {
    variant: "danger",
    value: 950,
  },
};
