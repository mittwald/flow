import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import DatePicker from "../index";
import { Label } from "@/components/Label";
import { FieldDescription } from "@/components/FieldDescription";
import { today, getLocalTimeZone, parseDate } from "@internationalized/date";

const meta: Meta<typeof DatePicker> = {
  title: "DatePicker/Date",
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
  // @ts-expect-error ...
  args: { minValue: today(getLocalTimeZone()) },
  render: (props) => (
    <DatePicker
      isRequired
      defaultValue={parseDate("2012-07-03")}
      {...props}
      isInvalid
      errorMessage="Date is in the past"
    >
      <Label>Future Date</Label>
    </DatePicker>
  ),
};

export const FutureDatesOnly: Story = {
  // @ts-expect-error ...
  args: { minValue: today(getLocalTimeZone()) },
  render: (props) => (
    <DatePicker isRequired {...props}>
      <Label>Future Date</Label>
      <FieldDescription>Select a future date</FieldDescription>
    </DatePicker>
  ),
};
