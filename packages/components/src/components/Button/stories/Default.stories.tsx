import type { Meta, StoryObj } from "@storybook/react";
import Button from "../Button";
import { faStar } from "@fortawesome/free-regular-svg-icons/faStar";
import React from "react";
import { Icon } from "@/components/Icon";
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

export const Small: Story = {
  args: {
    size: "s",
  },
};

export const WithIcon: Story = {
  render: (props) => (
    <Button {...props} aria-label="Add to favorites">
      <Icon faIcon={faStar} />
    </Button>
  ),
};

export const SmallWithIcon: Story = {
  render: (props) => (
    <Button {...props} aria-label="Add to favorites" size="s">
      <Icon faIcon={faStar} />
    </Button>
  ),
};
