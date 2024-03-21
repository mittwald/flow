import type { Meta, StoryObj } from "@storybook/react";
import { Radio, RadioGroup } from "../index";
import { Content } from "@/components/Content";
import { Text } from "@/components/Text";
import React from "react";
import { IconApp } from "@/components/Icon/components/icons";
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
      <Radio value="a">
        <IconApp />
        <Text>{dummyText.medium}</Text>
        <Content>{dummyText.medium}</Content>
      </Radio>
      <Radio value="b">
        <IconApp />
        <Text>{dummyText.medium}</Text>
        <Content>{dummyText.short}</Content>
      </Radio>
      <Radio value="c">
        <IconApp />
        <Text>{dummyText.short}</Text>
        <Content>{dummyText.medium}</Content>
      </Radio>
    </RadioGroup>
  ),
};

export const MultipleElements: Story = {
  render: (props) => (
    <RadioGroup {...props} defaultValue="0" aria-label="Rating">
      {Array(9)
        .fill("")
        .map((value, index) => (
          <Radio value={index.toString()} key={index}>
            <IconApp />
            <Text>{index + 1} Star</Text>
            <Content>{dummyText.medium}</Content>
          </Radio>
        ))}
    </RadioGroup>
  ),
};

export const SmallSpace: Story = {
  render: (props) => (
    <RadioGroup
      {...props}
      defaultValue="0"
      aria-label="Rating"
      style={{ width: "500px" }}
    >
      {Array(3)
        .fill("")
        .map((value, index) => (
          <Radio value={index.toString()} key={index}>
            <Text>{index + 1} Star</Text>
          </Radio>
        ))}
    </RadioGroup>
  ),
};
