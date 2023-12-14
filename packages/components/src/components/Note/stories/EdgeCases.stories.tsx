import type { Meta, StoryObj } from "@storybook/react";
import Note from "../Note";
import React from "react";
import { Heading } from "@/components/Heading";
import { Content } from "@/components/Content";
import { dummyText } from "@/lib/dummyText";

const meta: Meta<typeof Note> = {
  title: "Note/Edge Cases",
  component: Note,
  argTypes: {
    variant: {
      control: "inline-radio",
    },
  },
  args: { variant: "info" },
};

export default meta;

type Story = StoryObj<typeof Note>;

export const LongTexts: Story = {
  render: (props) => (
    <Note {...props}>
      <Heading>{dummyText.medium}</Heading>
      <Content>{dummyText.long}</Content>
    </Note>
  ),
};
