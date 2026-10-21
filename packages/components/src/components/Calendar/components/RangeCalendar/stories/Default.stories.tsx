import type { Meta, StoryObj } from "@storybook/react";
import { RangeCalendar } from "../index";
import {
  CalendarDate,
  getLocalTimeZone,
  parseDate,
  today,
} from "@internationalized/date";

const meta: Meta<typeof RangeCalendar> = {
  title: "Form Controls/RangeCalendar",
  component: RangeCalendar,
  args: {
    "aria-label": "Trip dates",
    isDisabled: false,
    isReadOnly: false,
  },
};

export default meta;

type Story = StoryObj<typeof RangeCalendar>;

export const Default: Story = {};

export const WithDefaultValue: Story = {
  args: {
    defaultValue: {
      start: parseDate("2030-07-03"),
      end: parseDate("2030-07-12"),
    },
  },
};

export const FutureDatesOnly: Story = {
  args: { minValue: today(getLocalTimeZone()) },
};

export const WithDefaultPresets: Story = {
  args: { withDatePickerPresets: true },
};

export const WithCustomPresets: Story = {
  args: {
    withDatePickerPresets: [
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
    ],
    minValue: today(getLocalTimeZone()),
  },
};
