import type { Meta, StoryObj } from "@storybook/react";
import Button from "../Button";
import React from "react";
import { IconPlus } from "@/components/Icon/components/icons";
import { action } from "@storybook/addon-actions";

const meta: Meta<typeof Button> = {
  title: "Buttons/Button",
  component: Button,
  args: {
    onPress: action("onPress"),
  },
  argTypes: {
    variant: {
      control: "inline-radio",
    },
    style: {
      control: "inline-radio",
    },
    size: {
      control: "inline-radio",
    },
  },
  parameters: {
    controls: { exclude: ["onPress"] },
  },
  render: (props) => <Button {...props}>Continue/Action</Button>,
};

export default meta;

type Story = StoryObj<typeof Button>;

export const Default: Story = {};

export const Small: Story = {
  args: {
    size: "s",
  },
};

export const WithIcon: Story = {
  render: (props) => (
    <Button {...props} aria-label="Add to favorites">
      <IconPlus />
    </Button>
  ),
};

export const SmallWithIcon: Story = {
  render: (props) => (
    <Button {...props} aria-label="Add to favorites" size="s">
      <IconPlus />
    </Button>
  ),
};
