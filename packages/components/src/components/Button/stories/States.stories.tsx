import type { Meta, StoryObj } from "@storybook/react";
import Button from "../Button";
import defaultMeta from "./Default.stories";
import { IconPlus } from "@/components/Icon/components/icons";
import React from "react";

const meta: Meta<typeof Button> = {
  ...defaultMeta,
  title: "Actions/Button/States",
};
export default meta;

type Story = StoryObj<typeof Button>;

export const DisabledSolid: Story = {
  args: {
    isDisabled: true,
  },
};

export const DisabledPlain: Story = {
  args: {
    isDisabled: true,
    style: "plain",
  },
};

export const PendingSolid: Story = {
  args: {
    isPending: true,
  },
};

export const PendingPlain: Story = {
  args: {
    isPending: true,
    style: "plain",
  },
};

export const PendingPlainWithIcon: Story = {
  args: {
    isPending: true,
    style: "plain",
  },
  render: (props) => (
    <Button {...props} aria-label="Add to favorites">
      <IconPlus />
    </Button>
  ),
};

export const SucceededSolid: Story = {
  args: {
    isSucceeded: true,
  },
};

export const FailedPlain: Story = {
  args: {
    isFailed: true,
    style: "plain",
  },
};
