import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { Slider } from "@/components/Slider";
import { Label } from "@/components/Label";

const meta: Meta<typeof Slider> = {
  title: "Form Controls/Slider",
  component: Slider,
  render: (props) => (
    <Slider {...props}>
      <Label>Amount</Label>
    </Slider>
  ),
};
export default meta;

type Story = StoryObj<typeof Slider>;

export const Default: Story = {};

export const WithUnit: Story = {
  render: (props) => (
    <Slider
      {...props}
      formatOptions={{
        style: "unit",
        unit: "gigabyte",
      }}
      minValue={20}
      maxValue={2000}
      defaultValue={200}
      step={20}
    >
      <Label>Storage</Label>
    </Slider>
  ),
};
