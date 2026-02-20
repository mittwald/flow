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
  args: {
    isDisabled: false,
    isReadOnly: false,
    isRequired: false,
  },
  render: (props) => (
    <DatePicker {...props} isRequired>
      <Label>Date</Label>
    </DatePicker>
  ),
};

export default meta;

type Story = StoryObj<typeof DatePicker>;

export const Default: Story = {};

export const WithFieldError: Story = {
  args: { isRequired: true },
  render: (props) => (
    <DatePicker
      {...props}
      isInvalid
      defaultValue={parseDate("2012-07-03")}
      minValue={today(getLocalTimeZone())}
    >
      <Label>Future Date</Label>
      <FieldError>Date is in the past</FieldError>
    </DatePicker>
  ),
};

export const FutureDatesOnly: Story = {
  render: (props) => (
    <DatePicker {...props} minValue={today(getLocalTimeZone())}>
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
