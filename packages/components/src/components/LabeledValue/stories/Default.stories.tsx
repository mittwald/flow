import type { Meta, StoryObj } from "@storybook/react";
import LabeledValue from "../LabeledValue";
import React from "react";
import { Label } from "@/components/Label";
import { Content } from "@/components/Content";
import { CopyToClipboardButton } from "@/components/CopyToClipboardButton";
import { InlineCode } from "@/components/InlineCode";
import { Link } from "@/components/Link";

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
      <CopyToClipboardButton text="My proSpace" />
    </LabeledValue>
  ),
};

export const WithInlineCode: Story = {
  render: (props) => (
    <LabeledValue {...props}>
      <Label>IP address</Label>
      <InlineCode>127.0.0.1</InlineCode>
      <CopyToClipboardButton text="127.0.0.1" />
    </LabeledValue>
  ),
};

export const WithLink: Story = {
  render: (props) => (
    <LabeledValue {...props}>
      <Label>Domain</Label>
      <Link>https://mittwald.de</Link>
      <CopyToClipboardButton text="https://mittwald.de" />
    </LabeledValue>
  ),
};
