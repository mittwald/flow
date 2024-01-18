import type { Meta, StoryObj } from "@storybook/react";
import Button from "../Button";
import { faStar } from "@fortawesome/free-regular-svg-icons/faStar";
import React from "react";
import { Icon } from "@/components/Icon";
import { Text } from "@/components/Text";
import { action } from "@storybook/addon-actions";
import { Skeleton } from "@/components/Skeleton";

const meta: Meta<typeof Button> = {
  title: "Button",
  component: Button,
  args: {
    onPress: action("onPress"),
  },
  argTypes: {
    variant: {
      control: "inline-radio",
    },
  },
  parameters: {
    controls: { exclude: ["onPress"] },
  },
  render: (props) => <Button {...props}>Button</Button>,
};

export default meta;

type Story = StoryObj<typeof Button>;

export const Default: Story = {};

export const Disabled: Story = {
  args: {
    isDisabled: true,
  },
};

export const WithIcon: Story = {
  render: (props) => (
    <Button {...props}>
      <Icon faIcon={faStar} />
      <Text>Add to favorites</Text>
    </Button>
  ),
};

export const WithOnlyIcon: Story = {
  render: (props) => (
    <Button {...props} aria-label="Add to favorites">
      <Icon faIcon={faStar} />
    </Button>
  ),
};
