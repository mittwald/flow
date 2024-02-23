import type { Meta, StoryObj } from "@storybook/react";
import Button from "../Button";
import defaultMeta from "./Default.stories";
import { Icon } from "@/components/Icon";
import React from "react";
import { IconStar } from "@tabler/icons-react";

const meta: Meta<typeof Button> = {
  ...defaultMeta,
  title: "Buttons/Button/States",
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
      <Icon tablerIcon={<IconStar />} />
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
