import type { Meta, StoryObj } from "@storybook/react";
import { ProgressBar } from "../index";
import React from "react";
import { Label } from "@/components/Label";

const meta: Meta<typeof ProgressBar> = {
  title: "Status/ProgressBar",
  component: ProgressBar,
  args: { showMaxValue: false, size: "m", status: "info" },
  argTypes: {
    status: {
      control: "inline-radio",
      options: ["info", "success", "warning", "danger"],
    },
    size: {
      control: "inline-radio",
      options: ["s", "m"],
    },
  },
  render: (props) => (
    <ProgressBar
      value={500}
      maxValue={1000}
      minValue={0}
      formatOptions={{ style: "unit", unit: "gigabyte" }}
      {...props}
    >
      <Label>Storage</Label>
    </ProgressBar>
  ),
};

export default meta;

type Story = StoryObj<typeof ProgressBar>;

export const Default: Story = {};

export const WithPercentage: Story = {
  render: (props) => (
    <ProgressBar value={50} {...props}>
      <Label>Storage</Label>
    </ProgressBar>
  ),
};

export const WithoutUnit: Story = {
  args: { showMaxValue: true },
  render: (props) => (
    <ProgressBar
      value={500}
      maxValue={1000}
      minValue={0}
      formatOptions={{ style: "decimal" }}
      {...props}
    >
      <Label>Storage</Label>
    </ProgressBar>
  ),
};

export const WithMaxValue: Story = {
  args: { showMaxValue: true },
};

export const Small: Story = {
  args: { size: "s" },
};
