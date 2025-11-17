import type { Meta, StoryObj } from "@storybook/react";
import { ComboBox } from "../index";
import React from "react";
import { Label } from "@/components/Label";
import defaultMeta from "./Default.stories";
import { dummyText } from "@/lib/dev/dummyText";

const meta: Meta<typeof ComboBox> = {
  ...defaultMeta,
  title: "Form Controls/ComboBox/Edge Cases",
};
export default meta;

type Story = StoryObj<typeof ComboBox>;

export const LongText: Story = {
  render: (props) => (
    <ComboBox {...props} defaultInputValue={dummyText.long}>
      <Label>Label</Label>
    </ComboBox>
  ),
};
