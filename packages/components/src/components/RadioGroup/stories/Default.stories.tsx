import type { Meta, StoryObj } from "@storybook/react";
import { Radio, RadioGroup } from "../index";
import { Text } from "@/components";
import React from "react";

const meta: Meta<typeof RadioGroup> = {
  title: "RadioGroup",
  component: RadioGroup,
  args: { defaultValue: "a" },
};
export default meta;

type Story = StoryObj<typeof RadioGroup>;

export const Default: Story = {
  args: {
    label: "Label",
    children: (
      <>
        <Radio value="a">
          <Text>Option A</Text>
        </Radio>
        <Radio value="b">
          <Text>Option B</Text>
        </Radio>
        <Radio value="c">
          <Text>Option C</Text>
        </Radio>
      </>
    ),
  },
};

export const Disabled: Story = {
  args: {
    label: "Label",
    children: (
      <>
        <Radio isDisabled value="a">
          <Text>Option A</Text>
        </Radio>
        <Radio isDisabled value="b">
          <Text>Option B</Text>
        </Radio>
        <Radio isDisabled value="c">
          <Text>Option C</Text>
        </Radio>
      </>
    ),
  },
};
