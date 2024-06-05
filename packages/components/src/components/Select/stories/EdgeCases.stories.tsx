import type { Meta, StoryObj } from "@storybook/react";
import Select from "../index";
import React from "react";
import { Label } from "@/components/Label";
import { Option } from "@/components/Options";
import defaultMeta from "./Default.stories";

const meta: Meta<typeof Select> = {
  ...defaultMeta,
  title: "Form Controls/Select/Edge Cases",
};
export default meta;

type Story = StoryObj<typeof Select>;

export const Default: Story = {
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
