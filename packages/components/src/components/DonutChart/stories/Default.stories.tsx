import type { Meta, StoryObj } from "@storybook/react";
import { DonutChart } from "../index";

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

export const Default: Story = {
  parameters: {
    controls: { exclude: ["segments", "showLegend", "legendPosition"] },
  },
};

export const WithUnit: Story = {
  args: {
    formatOptions: { style: "unit", unit: "gigabyte" },
    maxValue: 600,
    value: 300,
  },
  parameters: {
    controls: {
      exclude: [
        "segments",
        "showLegend",
        "legendPosition",
        "formatOptions",
        "maxValue",
        "value",
      ],
    },
  },
};

export const WithSegments: Story = {
  args: {
    segments: [
      { title: "Death Star plans", value: 28 },
      { title: "Star charts", value: 24 },
      { title: "Holograms", value: 8 },
      { title: "Comm logs", value: 10 },
      { title: "Droid backups", value: 12, color: "yellow" },
      { title: "Archives", value: 6, color: "#555" },
    ],
    legendPosition: "right",
    showLegend: true,
  },
  parameters: {
    controls: {
      exclude: ["segments", "status"],
    },
  },
  render: (props) => <DonutChart aria-label="storage" {...props} />,
};

export const WithTextValue: Story = {
  parameters: {
    controls: { exclude: ["segments", "showLegend", "legendPosition"] },
  },
  render: (props) => {
    const value = 300;

    return (
      <DonutChart {...props} value={value} maxValue={600}>
        <strong>{value}</strong>
        <small>GB</small>
      </DonutChart>
    );
  },
};
