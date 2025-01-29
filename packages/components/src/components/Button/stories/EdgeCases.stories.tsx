import type { Meta, StoryObj } from "@storybook/react";
import Button from "../Button";
import React from "react";
import { dummyText } from "@/lib/dev/dummyText";
import defaultMeta from "./Default.stories";

const meta: Meta<typeof Button> = {
  ...defaultMeta,
  title: "Actions/Button/Edge Cases",
};
export default meta;

type Story = StoryObj<typeof Button>;

export const LongText: Story = {
  render: (props) => <Button {...props}>{dummyText.long}</Button>,
};
