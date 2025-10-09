import type { Meta, StoryObj } from "@storybook/react";
import Button from "../Button";
import defaultMeta from "./Default.stories";
import { IconPlus } from "@/components/Icon/components/icons";
import React from "react";
import { Text } from "@/components/Text";
import IconChevronDown from "../../Icon/components/icons/IconChevronDown";

const meta: Meta<typeof Button> = {
  ...defaultMeta,
  title: "Actions/Button/States",
  render: (props) => (
    <Button {...props}>
      <Text>Add email address</Text>
      <IconChevronDown />
    </Button>
  ),
};
export default meta;

type Story = StoryObj<typeof Button>;

export const ReadOnly: Story = {
  args: {
    isReadOnly: true,
    onPress: () => console.log("pressed"),
  },
};

export const DisabledSolid: Story = {
  args: {
    isDisabled: true,
  },
};

export const DisabledPlain: Story = {
  args: {
    isDisabled: true,
    variant: "plain",
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
    variant: "plain",
  },
};

export const PendingPlainWithIcon: Story = {
  args: {
    isPending: true,
    variant: "plain",
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
    variant: "plain",
  },
};
