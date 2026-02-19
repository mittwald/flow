import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { Label } from "@/components/Label";
import { action } from "storybook/actions";
import FieldDescription from "@/components/FieldDescription/FieldDescription";
import { FieldError } from "@/components/FieldError";
import { TimeField } from "@/components/TimeField";
import { Time } from "@internationalized/date";

const meta: Meta<typeof TimeField> = {
  title: "Form Controls/TimeField",
  component: TimeField,
  args: {
    isDisabled: false,
    isReadOnly: false,
    isRequired: false,
  },
  render: (props) => (
    <TimeField onChange={action("onChange")} {...props}>
      <Label>Time</Label>
    </TimeField>
  ),
};

export default meta;

type Story = StoryObj<typeof TimeField>;

export const Default: Story = {};

export const WithFieldDescription: Story = {
  render: (props) => (
    <TimeField {...props}>
      <Label>Time</Label>
      <FieldDescription>Enter a time</FieldDescription>
    </TimeField>
  ),
};

export const WithDefaultValue: Story = {
  render: (props) => (
    <TimeField {...props} defaultValue={new Time(11, 45)}>
      <Label>Time</Label>
    </TimeField>
  ),
};

export const WithFieldError: Story = {
  render: (props) => (
    <TimeField {...props} isInvalid isRequired>
      <Label>Time</Label>
      <FieldError>Time is required</FieldError>
    </TimeField>
  ),
};

export const Granularity: Story = {
  args: { granularity: "hour" },
};

export const MinMaxValue: Story = {
  args: { minValue: new Time(8, 0), maxValue: new Time(16, 0) },
};
