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
  args: { isDisabled: false, isReadOnly: false, isRequired: false },
  render: (props) => (
    <SearchField onChange={action("onChange")} {...props}>
      <Label>Search</Label>
    </SearchField>
  ),
};

export default meta;

type Story = StoryObj<typeof SearchField>;

export const Default: Story = {};

export const WithFieldDescription: Story = {
  render: (props) => (
    <SearchField {...props}>
      <Label>Search</Label>
      <FieldDescription>Press enter to search</FieldDescription>
    </SearchField>
  ),
};

export const WithFieldError: Story = {
  render: (props) => (
    <SearchField {...props} defaultValue="test" isInvalid>
      <Label>Search</Label>
      <FieldError>Invalid search value</FieldError>
    </SearchField>
  ),
};
