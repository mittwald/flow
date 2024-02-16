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
      Content Box is an Element with a white background color and box shadow.
      Structure Elements like sections can be used inside of it to add padding.
    </ContentBox>
  ),
};
export default meta;

type Story = StoryObj<typeof ContentBox>;

export const Default: Story = {};
