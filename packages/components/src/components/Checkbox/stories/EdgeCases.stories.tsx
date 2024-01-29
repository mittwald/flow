import type { Meta, StoryObj } from "@storybook/react";
import { Checkbox } from "../index";
import React from "react";
import defaultMeta from "./Default.stories";
import { dummyText } from "@/lib/dev/dummyText";

const meta: Meta<typeof Checkbox> = {
  title: "Forms/Checkbox/EdgeCases",
  ...defaultMeta,
};

export default meta;

type Story = StoryObj<typeof Checkbox>;

export const LongTexts: Story = {
  render: (props) => <Checkbox {...props}>{dummyText.long}</Checkbox>,
};
