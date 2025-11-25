import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { Text } from "@/components/Text";
import { Color } from "@/components/Color";
import Heading from "@/components/Heading";

const meta: Meta<typeof Color> = {
  title: "Content/Color",
  component: Color,
  args: { color: "blue" },
  render: (props) => (
    <Text>
      Lorem ipsum dolor <Color {...props}>sit amet consectetur</Color>{" "}
      adipisicing elit.
    </Text>
  ),
};
export default meta;

type Story = StoryObj<typeof Color>;

export const Default: Story = {};

export const violet: Story = { args: { color: "violet" } };

export const Lilac: Story = { args: { color: "lilac" } };

export const Teal: Story = { args: { color: "teal" } };

export const Danger: Story = { args: { color: "danger" } };

export const Warning: Story = { args: { color: "warning" } };

export const Info: Story = { args: { color: "info" } };

export const Success: Story = { args: { color: "success" } };

export const Custom: Story = { args: { color: "#0fdf00" } };

export const InHeading: Story = {
  args: { color: "violet" },
  render: (props) => (
    <Heading>
      Lorem ipsum dolor <Color {...props}>sit amet consectetur</Color>{" "}
      adipisicing elit.
    </Heading>
  ),
};
