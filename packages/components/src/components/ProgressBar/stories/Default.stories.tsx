import type { Meta, StoryObj } from "@storybook/react";
import { ProgressBar } from "../index";
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
        { title: "X-Wings", value: 5 },
        { title: "Y-Wings", value: 10 },
        { title: "TIE Fighters", value: 4 },
        { title: "Star Destroyers", value: 7 },
        { title: "A-Wings", value: 12 },
        { title: "B-Wings", value: 24 },
        { title: "Shuttles", value: 5 },
        { title: "Freighters", value: 8 },
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
