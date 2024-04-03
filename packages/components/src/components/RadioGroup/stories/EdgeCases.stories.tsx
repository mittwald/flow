import type { Meta, StoryObj } from "@storybook/react";
import { Radio, RadioButton, RadioGroup } from "../index";
import React from "react";
import { dummyText } from "@/lib/dev/dummyText";
import defaultMeta from "./Default.stories";
import { Text } from "@/components/Text";
import { Content } from "@/components/Content";

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

export const MultipleRadioButtons: Story = {
  render: (props) => (
    <RadioGroup {...props} defaultValue="0" aria-label="Label">
      {Array(16)
        .fill("")
        .map((value, index) => (
          <RadioButton value={index.toString()} key={index}>
            <Text>{dummyText.short}</Text>
            <Content>{dummyText.short}</Content>
          </RadioButton>
        ))}
    </RadioGroup>
  ),
};

export const SmallSpace: Story = {
  render: (props) => (
    <RadioGroup {...props} defaultValue="0" aria-label="Label">
      {Array(3)
        .fill("")
        .map((value, index) => (
          <RadioButton value={index.toString()} key={index}>
            Option {index + 1}
          </RadioButton>
        ))}
    </RadioGroup>
  ),
  parameters: { viewport: { defaultViewport: "mobile1" } },
};
