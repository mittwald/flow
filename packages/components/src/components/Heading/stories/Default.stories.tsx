import type { Meta, StoryObj } from "@storybook/react";
import Heading from "../Heading";
import React from "react";

const meta: Meta<typeof Heading> = {
  title: "Heading",
  component: Heading,
  argTypes: {
    level: {
      control: "inline-radio",
      options: [1, 2, 3, 4, 5, 6],
    },
  },
  args: { level: 3 },
  render: (props) => <Heading {...props}>Heading...</Heading>,
};
export default meta;

type Story = StoryObj<typeof Heading>;

export const Default: Story = {};
