import type { Meta, StoryObj } from "@storybook/react";
import CurrencyValue from "../CurrencyValue";
import React from "react";

const meta: Meta<typeof CurrencyValue> = {
  title: "Currency Value",
  component: CurrencyValue,
  render: (props) => <CurrencyValue {...props} value={10} />,
};
export default meta;

type Story = StoryObj<typeof CurrencyValue>;

export const Default: Story = {};

export const CustomCurrency: Story = { args: { currency: "USD" } };
