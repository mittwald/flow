import type { Meta, StoryObj } from "@storybook/react";
import Note from "../Note";
import React from "react";
import { Heading } from "@/components/Heading";
import { Content } from "@/components/Content";
import { dummyText } from "@/lib/dev/dummyText";
import defaultMeta from "./Default.stories";

const meta: Meta<typeof Note> = {
  ...defaultMeta,
  title: "Status/Note/Edge Cases",
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
