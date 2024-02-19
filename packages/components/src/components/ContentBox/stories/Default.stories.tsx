import type { Meta, StoryObj } from "@storybook/react";
import ContentBox from "../ContentBox";
import React from "react";

const meta: Meta<typeof ContentBox> = {
  title: "Structure/Content Box",
  component: ContentBox,
  argTypes: {
    elementType: {
      control: "inline-radio",
      options: ["div", "main"],
    },
  },
  args: { elementType: "div" },
  render: (props) => (
    <ContentBox {...props}>
      Content Box is a structure element that can contain any content
    </ContentBox>
  ),
};
export default meta;

type Story = StoryObj<typeof ContentBox>;

export const Default: Story = {};
