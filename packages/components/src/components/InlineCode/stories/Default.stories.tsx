import type { Meta, StoryObj } from "@storybook/react";
import InlineCode from "../InlineCode";
import React from "react";
import { Text } from "@/components/Text";
import Section from "@/components/Section";

const meta: Meta<typeof InlineCode> = {
  title: "Content/InlineCode",
  component: InlineCode,
  args: { color: "default" },
  argTypes: {
    color: { control: "inline-radio", options: ["default", "dark", "light"] },
  },
  render: (props) => (
    <Section>
      <Text
        color={
          props.color === "dark" || props.color === "light"
            ? props.color
            : undefined
        }
      >
        Enter <InlineCode {...props}>yarn start</InlineCode> to start your app.
      </Text>
    </Section>
  ),
};

export default meta;

type Story = StoryObj<typeof InlineCode>;

export const Default: Story = {};

export const Dark: Story = {
  args: { color: "dark" },
  globals: {
    backgrounds: "light",
  },
};

export const Light: Story = {
  args: { color: "light" },
  globals: {
    backgrounds: "dark",
  },
};
