import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { Text } from "@/components/Text";
import { Color } from "@/components/Color";
import Heading from "@/components/Heading";
import { dummyText } from "@/lib/dev/dummyText";

const meta: Meta<typeof Color> = {
  title: "Content/Color",
  component: Color,
  args: { color: "blue" },
  render: (props) => <Color {...props}>{dummyText.short}</Color>,
};
export default meta;

type Story = StoryObj<typeof Color>;

export const Default: Story = {};

export const violet: Story = { args: { color: "lilac" } };

export const Lilac: Story = { args: { color: "lilac" } };

export const Teal: Story = { args: { color: "teal" } };

export const InText: Story = {
  args: { color: "violet" },
  render: (props) => (
    <Text>
      Lorem ipsum dolor <Color {...props}>sit amet consectetur</Color>{" "}
      adipisicing elit.
    </Text>
  ),
};

export const InHeading: Story = {
  args: { color: "violet" },
  render: (props) => (
    <Heading>
      Lorem ipsum dolor <Color {...props}>sit amet consectetur</Color>{" "}
      adipisicing elit.
    </Heading>
  ),
};
