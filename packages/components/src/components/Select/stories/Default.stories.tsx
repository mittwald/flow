import type { Meta, StoryObj } from "@storybook/react";
import Select, { Options, Option } from "../index";
import React from "react";
import { Label } from "@/components/Label";

const meta: Meta<typeof Select> = {
  title: "Form Controls/Select",
  component: Select,
  render: (props) => (
    <Select {...props}>
      <Label>Animal</Label>
      <Options>
        <Option>Aardvark</Option>
        <Option>Cat</Option>
        <Option>Dog</Option>
        <Option>Kangaroo</Option>
        <Option>Panda</Option>
        <Option>Snake</Option>
      </Options>
    </Select>
  ),
};
export default meta;

type Story = StoryObj<typeof Select>;

export const Default: Story = {};
