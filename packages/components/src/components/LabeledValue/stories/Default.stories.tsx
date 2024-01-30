import type { Meta, StoryObj } from "@storybook/react";
import LabeledValue from "../LabeledValue";
import React from "react";
import { Label } from "@/components/Label";
import { Content } from "@/components/Content";
import { CopyButton } from "@/components/CopyButton";

const meta: Meta<typeof LabeledValue> = {
  title: "Content/Labeled Value",
  component: LabeledValue,
  parameters: {
    controls: { exclude: ["className"] },
  },
  render: (props) => (
    <LabeledValue {...props}>
      <Label>Project</Label>
      <Content>My proSpace</Content>
    </LabeledValue>
  ),
};
export default meta;

type Story = StoryObj<typeof LabeledValue>;

export const Default: Story = {};

export const WithCopyButton: Story = {
  render: (props) => (
    <LabeledValue {...props}>
      <Label>Project</Label>
      <Content>My proSpace</Content>
      <CopyButton value="My proSpace" />
    </LabeledValue>
  ),
};
