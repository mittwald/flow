import type { Meta, StoryObj } from "@storybook/react";
import Label from "../Label";
import React from "react";
import { Skeleton } from "@/components/Skeleton";

const meta: Meta<typeof Label> = {
  title: "Label",
  component: Label,
  render: (props) => <Label {...props}>Label</Label>,
};
export default meta;

type Story = StoryObj<typeof Label>;

export const Default: Story = {};

export const Optional: Story = { args: { optional: true } };

export const WithSkeleton: Story = {
  render: (props) => (
    <Label {...props}>
      <Skeleton />
    </Label>
  ),
};
