import type { Meta, StoryObj } from "@storybook/react";
import { Radio, RadioGroup } from "../index";
import React from "react";
import { dummyText } from "@/lib/dev/dummyText";
import defaultMeta from "./Default.stories";

const meta: Meta<typeof RadioGroup> = {
  title: "Form Controls/RadioGroup/Edge Cases",
  ...defaultMeta,
};

export default meta;

type Story = StoryObj<typeof RadioGroup>;

export const LongTexts: Story = {
  render: (props) => (
    <RadioGroup {...props} defaultValue="a" aria-label="Label">
      <Radio value="a">{dummyText.medium} </Radio>
      <Radio value="b">{dummyText.medium} </Radio>
      <Radio value="c">{dummyText.medium}</Radio>
    </RadioGroup>
  ),
};
