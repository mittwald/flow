import type { Meta, StoryObj } from "@storybook/react";
import { CountrySelect } from "../index";
import React from "react";
import { Label } from "@/components/Label";
import defaultMeta from "./Default.stories";
import { FieldDescription } from "@/components/FieldDescription";
import { FieldError } from "@/components/FieldError";

const meta: Meta<typeof CountrySelect> = {
  ...defaultMeta,
  title: "Form Controls/CountrySelect/Edge Cases",
};
export default meta;

type Story = StoryObj<typeof CountrySelect>;

export const NonExistentCountryCode: Story = {
  args: { defaultSelectedKey: "XX" },
  render: (props) => (
    <CountrySelect {...props}>
      <Label>Country</Label>
    </CountrySelect>
  ),
};

export const WithCustomOnChange: Story = {
  render: (props) => (
    <CountrySelect
      {...props}
      onSelectionChange={(code) => {
        console.log(`Selected country: ${code}`);
        alert(`Selected country code: ${code}`);
      }}
    >
      <Label>Country (with logging)</Label>
    </CountrySelect>
  ),
};

export const WithDachFirstAndDefault: Story = {
  args: {
    dachFirst: true,
    defaultSelectedKey: "FR",
  },
};

export const WithAllProps: Story = {
  args: {
    dachFirst: true,
    defaultSelectedKey: "DE",
    isRequired: true,
    isDisabled: false,
    className: "custom-class",
  },
  render: (props) => (
    <CountrySelect {...props}>
      <Label>Country</Label>
      <FieldDescription>Complete example with all properties</FieldDescription>
      <FieldError>Select a country</FieldError>
    </CountrySelect>
  ),
};
