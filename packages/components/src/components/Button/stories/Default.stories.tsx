import type { Meta, StoryObj } from "@storybook/react";
import Button from "../Button";
import { faStar } from "@fortawesome/free-regular-svg-icons/faStar";
import React from "react";
import { Icon } from "@/components/Icon";
import { Text } from "@/components/Text";

const meta: Meta<typeof Button> = {
  title: "Button",
  component: Button,
  args: {
    children: "Button",
  },
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
  args: {
    children: (
      <>
        <Icon faIcon={faStar} />
        <Text>Add to favorites</Text>
      </>
    ),
  },
};

export const WithOnlyIcon: Story = {
  args: {
    "aria-label": "Add to favorites",
    children: <Icon faIcon={faStar} />,
  },
};
