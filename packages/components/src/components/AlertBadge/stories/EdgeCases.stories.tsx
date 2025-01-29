import type { Meta, StoryObj } from "@storybook/react";
import AlertBadge from "../AlertBadge";
import defaultMeta from "./Default.stories";
import React from "react";
import { dummyText } from "@/lib/dev/dummyText";

const meta: Meta<typeof AlertBadge> = {
  ...defaultMeta,
  title: "Status/AlertBadge/Edge Cases",
};
export default meta;

type Story = StoryObj<typeof AlertBadge>;

export const LongText: Story = {
  render: (props) => <AlertBadge {...props}>{dummyText.long}</AlertBadge>,
};
