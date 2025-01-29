import type { Meta, StoryObj } from "@storybook/react";
import Select, { Option } from "../index";
import React from "react";
import { Label } from "@/components/Label";
import defaultMeta from "./Default.stories";
import { dummyText } from "@/lib/dev/dummyText";

const meta: Meta<typeof Select> = {
  ...defaultMeta,
  title: "Form Controls/Select/Edge Cases",
};
export default meta;

type Story = StoryObj<typeof Select>;

export const ManyOptions: Story = {
  render: (props) => (
    <Select {...props}>
      <Label>Label</Label>
      {Array(20)
        .fill("")
        .map((value, index) => (
          <Option key={index}>Option {index + 1}</Option>
        ))}
    </Select>
  ),
};

export const LongTexts: Story = {
  render: (props) => (
    <Select {...props}>
      <Label>Label</Label>
      {Array(4)
        .fill("")
        .map((value, index) => (
          <Option key={index}>
            Option {index + 1} {dummyText.medium}
          </Option>
        ))}
    </Select>
  ),
};
