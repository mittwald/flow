import type { Meta, StoryObj } from "@storybook/react";
import AlertBadge from "../AlertBadge";
import React from "react";
import { dummyText } from "@/lib/dev/dummyText";
import { statusTypes } from "@/lib/types/props";

const meta: Meta<typeof AlertBadge> = {
  title: "Status/AlertBadge",
  component: AlertBadge,

  parameters: {
    controls: { exclude: ["className"] },
  },
  args: { status: "info" },
  argTypes: {
    status: {
      control: "inline-radio",
      options: statusTypes,
    },
  },
  render: (props) => <AlertBadge {...props}>{dummyText.short}</AlertBadge>,
};
export default meta;

type Story = StoryObj<typeof AlertBadge>;

export const Default: Story = {};
