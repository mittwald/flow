import type { Meta, StoryObj } from "@storybook/react";
import Button from "../Button";
import React from "react";
import { faStar } from "@fortawesome/free-regular-svg-icons/faStar";
import { Icon } from "@/components/Icon";
import { Text } from "@/components/Text";

const meta: Meta<typeof Button> = {
  title: "Button/Edge Cases",
  component: Button,
  args: {
    children: "Button",
  },
};
export default meta;

type Story = StoryObj<typeof Button>;

export const LongText: Story = {
  args: {
    children: "Button ".repeat(50),
  },
};

export const WithBreak: Story = {
  args: {
    children: (
      <>
        Line 1
        <br />
        Line 2
      </>
    ),
  },
};

export const WithBreakAndIcon: Story = {
  args: {
    children: (
      <>
        <Icon faIcon={faStar} />
        <Text>
          Add to <br /> favorites
        </Text>
      </>
    ),
  },
};
