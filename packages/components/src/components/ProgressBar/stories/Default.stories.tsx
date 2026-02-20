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
      options: ["s", "m", "l"],
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

export const WithSegments: Story = {
  parameters: {
    controls: { exclude: ["status"] },
  },
  render: (props) => (
    <ProgressBar
      {...props}
      segments={[
        { title: "Item 1", value: 5 },
        { title: "Item 2", value: 10 },
        { title: "Item 3", value: 4 },
        { title: "Item 4", value: 7 },
        { title: "Item 5", value: 12 },
        { title: "Item 6", value: 24 },
        { title: "Item 7", value: 5 },
        { title: "Item 8", value: 8 },
      ]}
    >
      <Label>Storage</Label>
    </ProgressBar>
  ),
};

export const WithSegmentsAndUnit: Story = {
  parameters: {
    controls: { exclude: ["status"] },
  },
  render: (props) => (
    <ProgressBar
      {...props}
      formatOptions={{ style: "unit", unit: "gigabyte" }}
      maxValue={60}
      segments={[
        { title: "Backups", value: 20 },
        { title: "Databases", value: 30 },
      ]}
    >
      <Label>Storage</Label>
    </ProgressBar>
  ),
};

export const WithValueLabel: Story = {
  render: (props) => {
    const value = 500;
    const maxValue = 1000;

    return (
      <ProgressBar
        value={value}
        maxValue={maxValue}
        minValue={0}
        valueLabel={`${value} / ${maxValue} GB`}
        {...props}
      >
        <Label>Storage</Label>
      </ProgressBar>
    );
  },
};
