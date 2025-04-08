import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { Rating } from "@/components/Rating";

const meta: Meta<typeof Rating> = {
  title: "Content/Rating",
  component: Rating,
  argTypes: {
    value: {
      control: "inline-radio",
      options: [0, 1, 2, 3, 4, 5],
    },
  },
  args: { value: 2 },
  render: (props) => <Rating {...props} />,
};

export default meta;

type Story = StoryObj<typeof Rating>;

export const Default: Story = {};

export const Small: Story = { args: { size: "s" } };
