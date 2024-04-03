import type { Meta, StoryObj } from "@storybook/react";
import LayoutCard from "../LayoutCard";
import React from "react";

const meta: Meta<typeof LayoutCard> = {
  title: "Structure/Layout Card",
  component: LayoutCard,
  argTypes: {
    elementType: {
      control: "inline-radio",
      options: ["div", "main"],
    },
  },
  args: { elementType: "div" },
  render: (props) => (
    <LayoutCard {...props}>
      Layout Card is a structure element that can contain any content
    </LayoutCard>
  ),
};
export default meta;

type Story = StoryObj<typeof LayoutCard>;

export const Default: Story = {};
