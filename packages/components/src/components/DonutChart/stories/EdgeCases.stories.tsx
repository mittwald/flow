import type { Meta, StoryObj } from "@storybook/react";
import defaultMeta from "./Default.stories";
import React from "react";
import { DonutChart } from "@/components/DonutChart";
import { dummyText } from "@/lib/dev/dummyText";

const meta: Meta<typeof DonutChart> = {
  title: "Data Visualisation/DonutChart/Edge Cases",
  ...defaultMeta,
};
export default meta;

type Story = StoryObj<typeof DonutChart>;

export const LongValue: Story = {
  render: () => <DonutChart value={1000000000000} maxValue={1100000000000} />,
};

export const LongTextValue: Story = {
  render: () => (
    <DonutChart value={10} size="l">
      {dummyText.short}
    </DonutChart>
  ),
};
