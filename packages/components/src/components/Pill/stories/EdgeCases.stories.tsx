import type { Meta, StoryObj } from "@storybook/react";
import Pill from "../Pill";
import defaultMeta from "./Default.stories";
import React from "react";
import { dummyText } from "@/lib/dummyText";

const meta: Meta<typeof Pill> = {
  ...defaultMeta,
  title: "Pill/EdgeCases",
};
export default meta;

type Story = StoryObj<typeof Pill>;

export const LongText: Story = {
  render: (props) => <Pill {...props}>{dummyText.long}</Pill>,
};
