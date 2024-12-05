import type { Meta, StoryObj } from "@storybook/react";
import { CountrySelect } from "../index";
import React from "react";
import { Label } from "@/components/Label";
import FieldDescription from "@/components/FieldDescription";
import { FieldError } from "@/components/FieldError";

const meta: Meta<typeof CountrySelect> = {
  title: "Form Controls/CountrySelect",
  component: CountrySelect,
  render: (props) => (
    <CountrySelect {...props}>
      <Label>Country</Label>
    </CountrySelect>
  ),
};
export default meta;

type Story = StoryObj<typeof CountrySelect>;

export const Default: Story = {};

export const Disabled: Story = {
  args: { isDisabled: true },
};

export const Required: Story = {
  args: { isRequired: true },
};

export const WithDefaultValue: Story = {
  args: { defaultSelectedKey: "DE" },
};

export const WithDachFirst: Story = {
  args: { dachFirst: true },
};

export const WithFieldDescription: Story = {
  render: (props) => (
    <CountrySelect {...props}>
      <Label>Country</Label>
      <FieldDescription>Select a country</FieldDescription>
    </CountrySelect>
  ),
};

export const WithFieldError: Story = {
  render: (props) => (
    <CountrySelect {...props} isInvalid isRequired>
      <Label>Country</Label>
      <FieldError>Select a country</FieldError>
    </CountrySelect>
  ),
};
