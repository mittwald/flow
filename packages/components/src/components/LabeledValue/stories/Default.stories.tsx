import type { Meta, StoryObj } from "@storybook/react";
import LabeledValue from "../LabeledValue";
import React from "react";
import { Label } from "@/components/Label";
import { CurrencyValue } from "@/components/CurrencyValue";
import { DateValue } from "@/components/DateValue";

const meta: Meta<typeof LabeledValue> = {
  title: "Labeled Value",
  component: LabeledValue,
  render: (props) => (
    <LabeledValue {...props} value="My proSpace">
      <Label>Project</Label>
    </LabeledValue>
  ),
};
export default meta;

type Story = StoryObj<typeof LabeledValue>;

export const Default: Story = {};

export const WithCurrencyValue: Story = {
  render: () => (
    <LabeledValue value={<CurrencyValue value={5.9} />}>
      <Label>Price</Label>
    </LabeledValue>
  ),
};

export const WithDateValue: Story = {
  render: () => (
    <LabeledValue value={<DateValue value={new Date()} />}>
      <Label>Date</Label>
    </LabeledValue>
  ),
};

export const Copyable: Story = {
  args: { copyable: true },
};
