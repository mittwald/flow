import type { Meta, StoryObj } from "@storybook/react";
import Badge from "../Badge";
import defaultMeta from "./Default.stories";
import React from "react";
import { dummyText } from "@/lib/dev/dummyText";

const meta: Meta<typeof Badge> = {
  ...defaultMeta,
  title: "Status/Badge/EdgeCases",
};
export default meta;

type Story = StoryObj<typeof Badge>;

export const LongText: Story = {
  render: (props) => <Badge {...props}>{dummyText.long}</Badge>,
};
