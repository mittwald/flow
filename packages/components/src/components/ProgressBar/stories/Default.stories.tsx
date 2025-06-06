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

export const WithSegments: Story = {
  args: {
    segments: [
      { title: "Item 1", value: 20 },
      { title: "Item 2", value: 30 },
    ],
    size: "l",
  },
  render: (props) => (
    <ProgressBar {...props}>
      <Label>Storage</Label>
    </ProgressBar>
  ),
};

export const WithSegmentsAndUnit: Story = {
  args: {
    formatOptions: { style: "unit", unit: "gigabyte" },
    showMaxValue: true,
    maxValue: 60,
    segments: [
      { title: "Backups", value: 20 },
      { title: "Databases", value: 30 },
    ],
    size: "l",
  },
  render: (props) => (
    <ProgressBar {...props}>
      <Label>Storage</Label>
    </ProgressBar>
  ),
};

export const WithSegmentsAndWithoutLegend: Story = {
  args: {
    formatOptions: { style: "unit", unit: "gigabyte" },
    showMaxValue: true,
    maxValue: 60,
    segments: [
      { title: "Backups", value: 20 },
      { title: "Databases", value: 30 },
    ],
    size: "s",
    showLegend: false,
  },
  render: (props) => (
    <ProgressBar {...props}>
      <Label>Storage</Label>
    </ProgressBar>
  ),
};

export const WithValueHigherThanMaxValue: Story = {
  args: { showMaxValue: true },
  render: (props) => (
    <ProgressBar
      value={2000}
      maxValue={1000}
      minValue={0}
      formatOptions={{ style: "unit", unit: "gigabyte" }}
      {...props}
    >
      <Label>Storage</Label>
    </ProgressBar>
  ),
};
