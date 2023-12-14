import type { Meta, StoryObj } from "@storybook/react";
import { Radio, RadioGroup } from "../index";
import { faStar } from "@fortawesome/free-regular-svg-icons/faStar";
import { Content } from "@/components/Content";
import { Text } from "@/components/Text";
import React from "react";
import { Icon } from "@/components/Icon";
import { dummyText } from "@/lib/dummyText";
import defaultMeta from "./Default.stories";

const meta: Meta<typeof RadioGroup> = {
  title: "RadioGroup/EdgeCases",
  ...defaultMeta,
};

export default meta;

type Story = StoryObj<typeof RadioGroup>;

export const LongTexts: Story = {
  render: (props) => (
    <RadioGroup {...props} defaultValue="a" aria-label="label">
      <Radio value="a">
        <Icon faIcon={faStar} />
        <Text>{dummyText.medium}</Text>
        <Content>{dummyText.medium}</Content>
      </Radio>
      <Radio value="b">
        <Icon faIcon={faStar} />
        <Text>{dummyText.medium}</Text>
        <Content>{dummyText.short}</Content>
      </Radio>
      <Radio value="c">
        <Icon faIcon={faStar} />
        <Text>{dummyText.short}</Text>
        <Content>{dummyText.medium}</Content>
      </Radio>
    </RadioGroup>
  ),
};

export const MultipleElements: Story = {
  render: (props) => (
    <RadioGroup {...props} defaultValue="0" aria-label="label">
      {Array(9)
        .fill("")
        .map((value, index) => (
          <Radio value={index.toString()} key={index}>
            <Icon faIcon={faStar} />
            <Text>Option {index + 1}</Text>
            <Content>{dummyText.medium}</Content>
          </Radio>
        ))}
    </RadioGroup>
  ),
};

export const SmallSpace: Story = {
  render: (props) => (
    <RadioGroup {...props} defaultValue="0" aria-label="label" style={{ width: "600px" }}>
      {Array(3)
        .fill("")
        .map((value, index) => (
          <Radio value={index.toString()} key={index}>
            <Text>Option {index + 1}</Text>
          </Radio>
        ))}
    </RadioGroup>
  ),
};
