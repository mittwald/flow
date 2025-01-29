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
