import type { Meta, StoryObj } from "@storybook/react";
import DateValue from "../DateValue";
import React from "react";

const meta: Meta<typeof DateValue> = {
  title: "Date Value",
  component: DateValue,
  render: (props) => <DateValue {...props} value={new Date()} />,
  argTypes: {
    format: {
      control: "inline-radio",
      defaultValue: "date",
    },
  },
  parameters: {
    controls: { exclude: ["value"] },
  },
};
export default meta;

type Story = StoryObj<typeof DateValue>;

export const Default: Story = {};

export const DateAndTime: Story = { args: { format: "dateTime" } };

export const Time: Story = { args: { format: "time" } };
