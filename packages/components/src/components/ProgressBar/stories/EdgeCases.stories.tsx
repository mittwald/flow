import type { Meta, StoryObj } from "@storybook/react";
import ProgressBar from "../ProgressBar";
import defaultMeta from "./Default.stories";
import { Label } from "@/components/Label";
import React from "react";
import { dummyText } from "@/lib/dev/dummyText";

const meta: Meta<typeof ProgressBar> = {
  ...defaultMeta,
  title: "Status/ProgressBar/Edge Cases",
};

export default meta;

type Story = StoryObj<typeof ProgressBar>;

export const LongText: Story = {
  render: (props) => (
    <ProgressBar
      value={500}
      maxValue={1000}
      minValue={0}
      showMaxValue
      formatOptions={{ style: "unit", unit: "gigabyte" }}
      {...props}
    >
      <Label>{dummyText.medium}</Label>
    </ProgressBar>
  ),
};

export const WithManySegments: Story = {
  args: {
    segments: [
      { title: "Item 1", value: 5 },
      { title: "Item 2", value: 10 },
      { title: "Item 3", value: 4 },
      { title: "Item 4", value: 7 },
      { title: "Item 5", value: 12 },
      { title: "Item 6", value: 24 },
      { title: "Item 7", value: 5 },
      { title: "Item 8", value: 8 },
      { title: "Item 9", value: 3 },
      { title: "Item 10", value: 6 },
      { title: "Item 11", value: 16 },
    ],
  },
  render: (props) => (
    <ProgressBar {...props}>
      <Label>Storage</Label>
    </ProgressBar>
  ),
};

export const WithZeroValueSegments: Story = {
  args: {
    segments: [
      { title: "Item 1", value: 0 },
      { title: "Item 2", value: 0 },
    ],
  },
  render: (props) => (
    <ProgressBar {...props}>
      <Label>Storage</Label>
    </ProgressBar>
  ),
};
