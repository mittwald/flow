import type { Meta, StoryObj } from "@storybook/react";
import Content from "../Content";
import React from "react";
import { Skeleton } from "@/components/Skeleton";

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
  render: (props) => (
    <Content {...props}>
      Content is a wrapper without any styling. By default it is rendered as a
      div.
    </Content>
  ),
};
export default meta;

type Story = StoryObj<typeof Content>;

export const Default: Story = {};

export const WithSkeleton: Story = {
  render: (props) => (
    <Content {...props}>
      <Skeleton />
    </Content>
  ),
};
