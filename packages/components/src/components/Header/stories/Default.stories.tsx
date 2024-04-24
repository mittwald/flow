import type { Meta, StoryObj } from "@storybook/react";
import Header from "../Header";
import React from "react";
import Section from "@/components/Section";

const meta: Meta<typeof Header> = {
  title: "Content/Header",
  component: Header,
  argTypes: {
    elementType: {
      control: "inline-radio",
      options: ["header", "div"],
    },
  },
  args: { elementType: "header" },
  render: (props) => (
    <Section>
      <Header {...props}>
        Header is a wrapper without any styling. By default it is rendered as a
        html header.
      </Header>
    </Section>
  ),
};
export default meta;

type Story = StoryObj<typeof Header>;

export const Default: Story = {};
