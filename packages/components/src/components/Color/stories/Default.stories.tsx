import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { Text } from "@/components/Text";
import { Color } from "@/components/Color";
import Heading from "@/components/Heading";
import { Section } from "@/components/Section";

const meta: Meta<typeof Color> = {
  title: "Content/Color",
  component: Color,
  args: { color: "blue" },
  argTypes: {
    color: {
      control: "inline-radio",
      options: [
        "blue",
        "violet",
        "teal",
        "lilac",
        "danger",
        "warning",
        "info",
        "success",
      ],
    },
  },
  render: (props) => (
    <Section>
      <Heading>
        Lorem <Color {...props}>ipsum</Color> dolor sit amet
      </Heading>
      <Text>
        Lorem ipsum dolor <Color {...props}>sit amet consectetur</Color>{" "}
        adipisicing elit.
      </Text>
    </Section>
  ),
};
export default meta;

type Story = StoryObj<typeof Color>;

export const Default: Story = {};

export const Custom: Story = {
  args: { color: "#0fdf00" },
  argTypes: {
    color: {
      control: "text",
    },
  },
};
