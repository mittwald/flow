import type { Meta, StoryObj } from "@storybook/react";
import Heading from "../Heading";
import React from "react";

const meta: Meta<typeof Heading> = {
  title: "Heading/Levels",
  component: Heading,
  argTypes: {
    level: {
      control: "inline-radio",
      options: [1, 2, 3, 4, 5, 6],
    },
  },
  render: (props) => <Heading {...props}>Heading...</Heading>,
};
export default meta;

type Story = StoryObj<typeof Heading>;

export const H1: Story = { args: { level: 1 } };

export const H2: Story = { args: { level: 2 } };

export const H3: Story = { args: { level: 3 } };

export const H4: Story = { args: { level: 4 } };

export const H5: Story = { args: { level: 5 } };

export const H6: Story = { args: { level: 6 } };
