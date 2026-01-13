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
  parameters: {
    controls: { exclude: ["tunnelId", "render", "showInitialMarker"] },
  },
  args: { defaultValue: 20 },
};
export default meta;

type Story = StoryObj<typeof Slider>;

export const Default: Story = {};

export const ReadOnly: Story = {
  args: { isReadOnly: true },
};

export const WithFormatOptions: Story = {
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

export const WithUnit: Story = {
  render: (props) => (
    <Slider
      {...props}
      unit="×"
      minValue={1}
      maxValue={3}
      defaultValue={2.5}
      step={0.5}
    >
      <Label>Zoom</Label>
    </Slider>
  ),
};

export const Disabled: Story = { args: { isDisabled: true } };

export const WithInitialMarker: Story = {
  render: (props) => (
    <Slider {...props} showInitialMarker>
      <Label>Amount</Label>
    </Slider>
  ),
};
