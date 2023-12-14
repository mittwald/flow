import type { Meta, StoryObj } from "@storybook/react";
import { Radio, RadioGroup } from "../index";
import { faStar } from "@fortawesome/free-regular-svg-icons/faStar";
import { Content } from "@/components/Content";
import { Text } from "@/components/Text";
import React from "react";
import { Icon } from "@/components/Icon";
import { dummyText } from "@/lib/dummyText";

const meta: Meta<typeof RadioGroup> = {
  title: "RadioGroup/EdgeCases",
  component: RadioGroup,
  args: { defaultValue: "a" },
};
export default meta;

type Story = StoryObj<typeof RadioGroup>;

export const LongTexts: Story = {
  args: {
    "aria-label": "label",
    children: (
      <>
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
      </>
    ),
  },
};

export const MultipleElements: Story = {
  args: {
    "aria-label": "label",
    defaultValue: "0",
    children: Array(9)
      .fill("")
      .map((value, index) => (
        <Radio value={index.toString()} key={index}>
          <Icon faIcon={faStar} />
          <Text>Option {index + 1}</Text>
          <Content>{dummyText.medium}</Content>
        </Radio>
      )),
  },
};

export const SmallSpace: Story = {
  args: {
    "aria-label": "label",
    style: { width: "600px" },
    defaultValue: "0",
    children: Array(3)
      .fill("")
      .map((value, index) => (
        <Radio value={index.toString()} key={index}>
          <Text>Option {index + 1}</Text>
        </Radio>
      )),
  },
};
