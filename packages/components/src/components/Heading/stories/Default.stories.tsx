import type { Meta, StoryObj } from "@storybook/react";
import Heading from "../Heading";
import React from "react";
import Text from "@/components/Text";
import { Skeleton } from "@/components/Skeleton";

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
  render: (props) => (
    <Heading {...props}>I am a H{props.level} Heading</Heading>
  ),
};
export default meta;

type Story = StoryObj<typeof Heading>;

export const Default: Story = {};

export const WithSkeleton: Story = {
  render: (props) => (
    <Heading {...props}>
      <Skeleton />
    </Heading>
  ),
};
