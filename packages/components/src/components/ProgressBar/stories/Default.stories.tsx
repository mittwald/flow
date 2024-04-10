import type { Meta, StoryObj } from "@storybook/react";
import { ProgressBar } from "../index";
import React from "react";
import { Label } from "@/components/Label";

const meta: Meta<typeof ProgressBar> = {
  title: "Status/Progress Bar",
  component: ProgressBar,
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

export const WithMaxValue: Story = {
  args: { showMaxValue: true },
};

export const Small: Story = {
  args: { size: "s" },
};
