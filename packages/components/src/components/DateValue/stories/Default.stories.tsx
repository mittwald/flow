import type { Meta, StoryObj } from "@storybook/react";
import DateValue from "../DateValue";
import React from "react";

const meta: Meta<typeof DateValue> = {
  title: "Date Value",
  component: DateValue,
  render: (props) => <DateValue {...props} value={new Date()} />,
};
export default meta;

type Story = StoryObj<typeof DateValue>;

export const Default: Story = {};

export const WithTime: Story = { args: { format: "dateTime" } };
