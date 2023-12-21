import type { Meta, StoryObj } from "@storybook/react";
import Content from "../Content";
import React from "react";

const meta: Meta<typeof Content> = {
  title: "Content",
  component: Content,
  argTypes: {
    elementType: {
      control: "inline-radio",
      options: ["div", "section"],
    },
  },
  args: { elementType: "div" },
  render: (props) => <Content {...props}>Content...</Content>,
};
export default meta;

type Story = StoryObj<typeof Content>;

export const Default: Story = {};
