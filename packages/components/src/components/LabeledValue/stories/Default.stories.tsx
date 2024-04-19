import type { Meta, StoryObj } from "@storybook/react";
import LabeledValue from "../LabeledValue";
import React from "react";
import { Label } from "@/components/Label";
import { Content } from "@/components/Content";
import { CopyButton } from "@/components/CopyButton";
import { InlineCode } from "@/components/InlineCode";
import { Link } from "@/components/Link";
import { Skeleton } from "@/components/Skeleton";

const meta: Meta<typeof LabeledValue> = {
  title: "Content/LabeledValue",
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
      <CopyButton text="My proSpace" />
    </LabeledValue>
  ),
};

export const WithInlineCode: Story = {
  render: (props) => (
    <LabeledValue {...props}>
      <Label>IP address</Label>
      <InlineCode>127.0.0.1</InlineCode>
      <CopyButton text="127.0.0.1" />
    </LabeledValue>
  ),
};

export const WithLink: Story = {
  render: (props) => (
    <LabeledValue {...props}>
      <Label>Domain</Label>
      <Link>https://mittwald.de</Link>
      <CopyButton text="https://mittwald.de" />
    </LabeledValue>
  ),
};

export const WithSkeleton: Story = {
  render: (props) => (
    <LabeledValue {...props}>
      <Label>Domain</Label>
      <Skeleton />
    </LabeledValue>
  ),
};
