import type { Meta, StoryObj } from "@storybook/react";
import { Segment, SegmentedControlGroup } from "../index";
import { Text } from "@/components/Text";
import React from "react";
import { dummyText } from "@/lib/dev/dummyText";
import defaultMeta from "./Default.stories";

const meta: Meta<typeof SegmentedControlGroup> = {
  title: "Actions/SegmentedButton/Edge Cases",
  ...defaultMeta,
};

export default meta;

type Story = StoryObj<typeof SegmentedControlGroup>;

export const LongTexts: Story = {
  render: (props) => (
    <SegmentedControlGroup {...props} defaultValue="a" aria-label="Label">
      <Segment value="a">{dummyText.medium}</Segment>
      <Segment value="b">{dummyText.medium}</Segment>
      <Segment value="c">{dummyText.medium}</Segment>
    </SegmentedControlGroup>
  ),
};

export const SmallSpace: Story = {
  render: (props) => (
    <SegmentedControlGroup {...props} defaultValue="0" aria-label="Label">
      {Array(3)
        .fill("")
        .map((value, index) => (
          <Segment value={index.toString()} key={index}>
            <Text>Option {index + 1}</Text>
          </Segment>
        ))}
    </SegmentedControlGroup>
  ),
  parameters: { viewport: { defaultViewport: "mobile1" } },
};
