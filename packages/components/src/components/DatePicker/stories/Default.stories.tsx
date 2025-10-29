import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import DatePicker from "../index";
import { Label } from "@/components/Label";
import { FieldDescription } from "@/components/FieldDescription";
import {
  type DateValue,
  getLocalTimeZone,
  parseDate,
  today,
} from "@internationalized/date";
import { FieldError } from "@/components/FieldError";

const meta: Meta<typeof DatePicker> = {
  title: "Form Controls/DatePicker",
  component: DatePicker,
  render: (props) => (
    <DatePicker {...props} isRequired>
      <Label>Date</Label>
    </DatePicker>
  ),
  parameters: {
    controls: { exclude: ["errorMessage"] },
  },
};

export default meta;

type Story = StoryObj<typeof DatePicker>;

export const Default: Story = {};

export const Disabled: Story = { args: { isDisabled: true } };

export const Invalid: Story = {
  args: { minValue: today(getLocalTimeZone()) },
  render: (props) => (
    <DatePicker
      isRequired
      defaultValue={parseDate("2012-07-03")}
      {...props}
      isInvalid
    >
      <Label>Future Date</Label>
      <FieldError>Date is in the past</FieldError>
    </DatePicker>
  ),
};

export const FutureDatesOnly: Story = {
  args: { minValue: today(getLocalTimeZone()) },
  render: (props) => (
    <DatePicker isRequired {...props}>
      <Label>Future Date</Label>
      <FieldDescription>Select a future date</FieldDescription>
    </DatePicker>
  ),
};

export const OnlyOneDayInMonth: Story = {
  render: (props) => (
    <DatePicker
      isRequired
      isDateUnavailable={(date: DateValue) => date.day !== 1}
      {...props}
    >
      <Label>Future Date</Label>
    </DatePicker>
  ),
};
