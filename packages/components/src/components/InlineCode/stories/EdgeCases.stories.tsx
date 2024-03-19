import type { Meta, StoryObj } from "@storybook/react";
import InlineCode from "../InlineCode";
import React from "react";
import { Text } from "@/components/Text";
import defaultStories from "./Default.stories";
import { dummyText } from "@/lib/dev/dummyText";

const meta: Meta<typeof InlineCode> = {
  ...defaultStories,
  title: "Content/InlineCode/Edge Cases",
};
export default meta;

type Story = StoryObj<typeof InlineCode>;

export const LongText: Story = {
  render: (props) => (
    <Text>
      {dummyText.medium}{" "}
      <InlineCode {...props}>{dummyText.medium.replaceAll(" ", "")}</InlineCode>{" "}
      {dummyText.medium}
      <InlineCode {...props}>{dummyText.medium}</InlineCode> {dummyText.medium}
    </Text>
  ),
};
