import type { Meta, StoryObj } from "@storybook/react";
import { DonutChart } from "../index";
import React from "react";

const meta: Meta<typeof DonutChart> = {
  title: "Data Visualisation/DonutChart",
  component: DonutChart,
  args: { size: "m", status: "info" },
  argTypes: {
    status: {
      control: "inline-radio",
      options: ["info", "success", "warning", "danger"],
    },
    size: {
      control: "inline-radio",
      options: ["m", "l"],
    },
    legendPosition: {
      control: "inline-radio",
      options: ["top", "right", "bottom", "left"],
    },
  },
  parameters: {
    controls: { exclude: ["segments"] },
  },
  render: (props) => <DonutChart value={30} {...props} />,
};

export default meta;

type Story = StoryObj<typeof DonutChart>;

export const Default: Story = {};

export const WithUnit: Story = {
  args: {
    formatOptions: { style: "unit", unit: "gigabyte" },
    maxValue: 600,
    value: 300,
  },
};

export const WithSegments: Story = {
  args: {
    segments: [
      { title: "Item 1", value: 50 },
      { title: "Item 2", value: 25 },
      { title: "Item 3", value: 12 },
    ],
    size: "l",
  },
  render: (props) => <DonutChart aria-label="storage" {...props} />,
};

export const WithLegend: Story = {
  args: {
    segments: [
      { title: "Item 1", value: 28 },
      { title: "Item 2", value: 24 },
      { title: "Item 3", value: 20 },
      { title: "Item 4", value: 10 },
      { title: "Item 5", value: 12 },
      { title: "Item 6", value: 6 },
    ],
    size: "l",
    showLegend: true,
    legendPosition: "top",
  },
  render: (props) => <DonutChart aria-label="storage" {...props} />,
};

export const WithTextValue: Story = {
  args: {
    maxValue: 600,
  },
  render: (props) => {
    const value = 300;

    return (
      <DonutChart {...props} value={value}>
        <b>{value}</b>
        <small>GB</small>
      </DonutChart>
    );
  },
};
