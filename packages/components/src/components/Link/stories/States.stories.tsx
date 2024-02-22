import type { Meta, StoryObj } from "@storybook/react";
import Link from "../Link";
import defaultMeta from "./Default.stories";

const meta: Meta<typeof Link> = {
  ...defaultMeta,
  title: "Navigation/Link/States",
};
export default meta;

type Story = StoryObj<typeof Link>;

export const Disabled: Story = {
  args: {
    isDisabled: true,
  },
};

export const Pending: Story = {
  args: {
    isPending: true,
  },
};

export const Succeeded: Story = {
  args: {
    isSucceeded: true,
  },
};

export const Failed: Story = {
  args: {
    isFailed: true,
  },
};
