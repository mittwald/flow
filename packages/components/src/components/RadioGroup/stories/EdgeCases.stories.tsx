import type { Meta, StoryObj } from "@storybook/react";
import { Radio, RadioGroup } from "../index";
import { Content } from "@/components/Content";
import { Text } from "@/components/Text";
import React from "react";
import { Icon } from "@/components/Icon";
import { dummyText } from "@/lib/dev/dummyText";
import defaultMeta from "./Default.stories";
import { IconStar } from "@tabler/icons-react";

const meta: Meta<typeof RadioGroup> = {
  title: "Forms/RadioGroup/EdgeCases",
  ...defaultMeta,
};

export default meta;

type Story = StoryObj<typeof RadioGroup>;

export const LongTexts: Story = {
  render: (props) => (
    <RadioGroup {...props} defaultValue="a" aria-label="Label">
      <Radio value="a">
        <Icon tablerIcon={<IconStar />} />
        <Text>{dummyText.medium}</Text>
        <Content>{dummyText.medium}</Content>
      </Radio>
      <Radio value="b">
        <Icon tablerIcon={<IconStar />} />
        <Text>{dummyText.medium}</Text>
        <Content>{dummyText.short}</Content>
      </Radio>
      <Radio value="c">
        <Icon tablerIcon={<IconStar />} />
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
            <Icon tablerIcon={<IconStar />} />
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
      style={{ width: "600px" }}
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
