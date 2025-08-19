import type { Meta, StoryObj } from "@storybook/react";
import { SearchField } from "../index";
import React from "react";
import { action } from "storybook/actions";
import { Label } from "@/components/Label";
import FieldDescription from "@/components/FieldDescription";
import { FieldError } from "@/components/FieldError";

const meta: Meta<typeof SearchField> = {
  title: "Form Controls/SearchField",
  component: SearchField,
  render: (props) => <SearchField onChange={action("onChange")} {...props} />,
};

export default meta;

type Story = StoryObj<typeof SearchField>;

export const Default: Story = {};

export const Disabled: Story = { args: { isDisabled: true } };

export const ReadOnly: Story = { args: { isReadOnly: true } };

export const WithFieldDescription: Story = {
  render: (props) => (
    <SearchField {...props}>
      <FieldDescription>Press enter to search</FieldDescription>
    </SearchField>
  ),
};

export const WithLabel: Story = {
  render: (props) => (
    <SearchField {...props}>
      <Label>Suche</Label>
    </SearchField>
  ),
};

export const WithFieldError: Story = {
  render: (props) => (
    <SearchField {...props} defaultValue="test" isInvalid>
      <FieldError>Invalid search value</FieldError>
    </SearchField>
  ),
};
