import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { Slider } from "@/components/Slider";
import { Label } from "@/components/Label";

const meta: Meta<typeof Slider> = {
  title: "Form Controls/Slider",
  component: Slider,
  render: (props) => (
    <Slider {...props}>
      <Label>Storage</Label>
    </Slider>
  ),
};
export default meta;

type Story = StoryObj<typeof Slider>;

export const Default: Story = {};
