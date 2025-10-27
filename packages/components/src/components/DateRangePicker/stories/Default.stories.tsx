import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { DateRangePicker } from "../index";
import { Label } from "@/components/Label";
import { FieldDescription } from "@/components/FieldDescription";
import { getLocalTimeZone, parseDate, today } from "@internationalized/date";
import { FieldError } from "@/components/FieldError";

const meta: Meta<typeof DateRangePicker> = {
  title: "Form Controls/DateRangePicker",
  component: DateRangePicker,
  render: (props) => (
    <DateRangePicker {...props} isRequired>
      <Label>Date</Label>
    </DateRangePicker>
  ),
};

export default meta;

type Story = StoryObj<typeof DateRangePicker>;

export const Default: Story = {};

export const Disabled: Story = { args: { isDisabled: true } };

export const Invalid: Story = {
  args: { minValue: today(getLocalTimeZone()) },
  render: (props) => (
    <DateRangePicker
      isRequired
      defaultValue={{
        start: parseDate("2012-07-03"),
        end: parseDate("2012-07-04"),
      }}
      {...props}
      isInvalid
    >
      <Label>Future Date</Label>
      <FieldError>Date is in the past</FieldError>
    </DateRangePicker>
  ),
};

export const FutureDatesOnly: Story = {
  args: { minValue: today(getLocalTimeZone()) },
  render: (props) => (
    <DateRangePicker isRequired {...props}>
      <Label>Future Date</Label>
      <FieldDescription>Select a future date</FieldDescription>
    </DateRangePicker>
  ),
};
