import type { Meta, StoryObj } from "@storybook/react";
import InlineCode from "../InlineCode";
import React from "react";
import { Text } from "@/components/Text";
import { StoryBackground } from "@/lib/dev/StoryBackground";
import { dummyText } from "@/lib/dev/dummyText";

const meta: Meta<typeof InlineCode> = {
  title: "Content/InlineCode",
  component: InlineCode,
  args: { color: "default" },
  argTypes: {
    color: { control: "inline-radio", options: ["default", "dark", "light"] },
  },
  render: (props) => (
    <StoryBackground color={props.color}>
      <InlineCode {...props}>{dummyText.short}</InlineCode>
      <br />
      <Text color={props.color}>
        Enter <InlineCode {...props}>yarn start</InlineCode> to start your app.
      </Text>
    </StoryBackground>
  ),
};

export default meta;

type Story = StoryObj<typeof InlineCode>;

export const Default: Story = {};
