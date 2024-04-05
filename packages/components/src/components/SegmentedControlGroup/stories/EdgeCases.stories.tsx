import type { Meta, StoryObj } from "@storybook/react";
import { SegmentedControlGroup } from "../index";
import { Text } from "@/components/Text";
import React from "react";
import { dummyText } from "@/lib/dev/dummyText";
import defaultMeta from "./Default.stories";
import { Radio } from "@/components/RadioGroup";

const meta: Meta<typeof SegmentedControlGroup> = {
  title: "Actions/SegmentedControlGroup/Edge Cases",
  ...defaultMeta,
};

export default meta;

type Story = StoryObj<typeof SegmentedControlGroup>;

export const LongTexts: Story = {
  render: (props) => (
    <SegmentedControlGroup {...props} defaultValue="a" aria-label="Label">
      <Radio value="a">{dummyText.medium}</Radio>
      <Radio value="b">{dummyText.medium}</Radio>
      <Radio value="c">{dummyText.medium}</Radio>
    </SegmentedControlGroup>
  ),
};

export const SmallSpace: Story = {
  render: (props) => (
    <SegmentedControlGroup {...props} defaultValue="0" aria-label="Label">
      {Array(3)
        .fill("")
        .map((value, index) => (
          <Radio value={index.toString()} key={index}>
            <Text>Option {index + 1}</Text>
          </Radio>
        ))}
    </SegmentedControlGroup>
  ),
  parameters: { viewport: { defaultViewport: "mobile1" } },
};
