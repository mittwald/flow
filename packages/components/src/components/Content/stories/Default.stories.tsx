import type { Meta, StoryObj } from "@storybook/react";
import Content from "../Content";
import React from "react";
import Section from "@/components/Section";

const meta: Meta<typeof Content> = {
  title: "Content/Content",
  component: Content,
  argTypes: {
    elementType: {
      control: "inline-radio",
      options: ["div", "section"],
    },
  },
  args: { elementType: "div" },
  render: (props) => (
    <Section>
      <Content {...props}>
        Content is a wrapper without any styling. By default it is rendered as a
        div.
      </Content>
    </Section>
  ),
};
export default meta;

type Story = StoryObj<typeof Content>;

export const Default: Story = {};
