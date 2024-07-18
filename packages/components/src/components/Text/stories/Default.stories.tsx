import type { Meta, StoryObj } from "@storybook/react";
import Text from "../Text";
import React from "react";
import Section from "@/components/Section";
import {
  storyBackgroundDark,
  storyBackgroundLight,
} from "@/lib/dev/storyBackgrounds";

const meta: Meta<typeof Text> = {
  title: "Content/Text",
  component: Text,
  argTypes: {
    elementType: {
      control: "inline-radio",
      options: ["span", "p"],
      defaultValue: "span",
    },
  },
  args: {
    elementType: "span",
  },
  render: (props) => (
    <Section>
      <Text {...props}>
        Text is an unstyled component that can be used to display texts. By
        default it renders a span.
      </Text>
    </Section>
  ),
};
export default meta;

type Story = StoryObj<typeof Text>;

export const Default: Story = {};

export const RawText: Story = {
  render: (props) => (
    <Text {...props}>Text without styling parent components</Text>
  ),
};

export const Dark: Story = {
  args: { color: "dark" },
  parameters: {
    backgrounds: storyBackgroundLight,
  },
};

export const Light: Story = {
  args: { color: "light" },
  parameters: {
    backgrounds: storyBackgroundDark,
  },
};
