import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { DateRangePicker } from "../index";
import { Label } from "@/components/Label";
import { FieldDescription } from "@/components/FieldDescription";
import {
  CalendarDate,
  getLocalTimeZone,
  parseDate,
  today,
} from "@internationalized/date";
import { FieldError } from "@/components/FieldError";

const meta: Meta<typeof DateRangePicker> = {
  title: "Form Controls/DateRangePicker",
  component: DateRangePicker,
  args: {
    isDisabled: false,
    isReadOnly: false,
    isRequired: false,
  },
  render: (props) => (
    <DateRangePicker {...props} isRequired>
      <Label>Date range</Label>
    </DateRangePicker>
  ),
};

export default meta;

type Story = StoryObj<typeof DateRangePicker>;

export const Default: Story = {};

export const Invalid: Story = {
  args: { isRequired: true },
  render: (props) => (
    <DateRangePicker
      isRequired
      defaultValue={{
        start: parseDate("2012-07-03"),
        end: parseDate("2012-07-04"),
      }}
      {...props}
      isInvalid
      minValue={today(getLocalTimeZone())}
    >
      <Label>Future date range</Label>
      <FieldError>Date is in the past</FieldError>
    </DateRangePicker>
  ),
};

export const FutureDatesOnly: Story = {
  render: (props) => (
    <DateRangePicker minValue={today(getLocalTimeZone())} {...props}>
      <Label>Future date range</Label>
      <FieldDescription>Select a future date range</FieldDescription>
    </DateRangePicker>
  ),
};

export const WithDefaultPresets: Story = {
  args: { minValue: today(getLocalTimeZone()) },
  render: (props) => (
    <DateRangePicker withDatePickerPresets {...props}>
      <Label>DatePicker WithPresets</Label>
    </DateRangePicker>
  ),
};

export const WithCustomPresets: Story = {
  args: { minValue: today(getLocalTimeZone()) },
  render: (props) => (
    <DateRangePicker
      withDatePickerPresets={[
        {
          label: "I am valid",
          start: new CalendarDate(2060, 1, 1),
          end: new CalendarDate(2061, 1, 1),
        },
        {
          label: "I am disabled",
          start: new CalendarDate(2022, 1, 1),
          end: new CalendarDate(2023, 1, 1),
        },
      ]}
      {...props}
    >
      <Label>DatePicker Presents</Label>
    </DateRangePicker>
  ),
};
