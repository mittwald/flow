import type { Meta, StoryObj } from "@storybook/react";
import StatusBadge from "../StatusBadge";
import defaultMeta from "./Default.stories";
import React from "react";
import { dummyText } from "@/lib/dev/dummyText";

const meta: Meta<typeof StatusBadge> = {
  ...defaultMeta,
  title: "Status/StatusBadge/Edge Cases",
};
export default meta;

type Story = StoryObj<typeof StatusBadge>;

export const LongText: Story = {
  render: (props) => <StatusBadge {...props}>{dummyText.long}</StatusBadge>,
};
