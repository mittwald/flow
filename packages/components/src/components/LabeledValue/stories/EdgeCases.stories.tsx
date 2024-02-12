import type { Meta, StoryObj } from "@storybook/react";
import LabeledValue from "../LabeledValue";
import defaultMeta from "./Default.stories";
import { dummyText } from "@/lib/dev/dummyText";
import { Label } from "@/components/Label";
import { Content } from "@/components/Content";
import React from "react";
import { CopyToClipboardButton } from "@/components/CopyToClipboardButton";

const meta: Meta<typeof LabeledValue> = {
  title: "Content/Labeled Value/Edge Cases",
  ...defaultMeta,
};
export default meta;

type Story = StoryObj<typeof LabeledValue>;

export const LongLabel: Story = {
  render: (props) => (
    <LabeledValue {...props}>
      <Label>{dummyText.medium}</Label>
      <Content>{dummyText.short}</Content>
      <CopyToClipboardButton text={dummyText.short} />
    </LabeledValue>
  ),
};
export const LongContent: Story = {
  render: (props) => (
    <LabeledValue {...props}>
      <Label>{dummyText.medium}</Label>
      <Content>{dummyText.long}</Content>
      <CopyToClipboardButton text={dummyText.long} />
    </LabeledValue>
  ),
};
