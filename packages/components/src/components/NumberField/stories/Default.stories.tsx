import type { Meta, StoryObj } from "@storybook/react";
import { NumberField } from "../index";
import React from "react";
import { Label } from "@/components/Label";
import { action } from "storybook/actions";
import FieldDescription from "@/components/FieldDescription/FieldDescription";
import { FieldError } from "@/components/FieldError";
import {
  ContextualHelp,
  ContextualHelpTrigger,
} from "@/components/ContextualHelp";
import { Button } from "@/components/Button";
import { Text } from "@/components/Text";

const meta: Meta<typeof NumberField> = {
  title: "Form Controls/NumberField",
  component: NumberField,
  render: (props) => (
    <NumberField onChange={action("onChange")} {...props}>
      <Label>Age</Label>
    </NumberField>
  ),
};

export default meta;

type Story = StoryObj<typeof NumberField>;

export const Default: Story = {};

export const Disabled: Story = { args: { isDisabled: true } };

export const ReadOnly: Story = {
  args: { isReadOnly: true },
};

export const Required: Story = { args: { isRequired: true } };

export const WithFieldDescription: Story = {
  render: (props) => (
    <NumberField {...props} minValue={5} maxValue={10}>
      <Label>Age</Label>
      <FieldDescription>Enter your age</FieldDescription>
    </NumberField>
  ),
};

export const WithDefaultValue: Story = {
  render: (props) => (
    <NumberField {...props} defaultValue={34}>
      <Label>Age</Label>
    </NumberField>
  ),
};

export const WithFieldError: Story = {
  render: (props) => (
    <NumberField {...props} isInvalid isRequired>
      <Label>Age</Label>
      <FieldError>Age is required</FieldError>
    </NumberField>
  ),
};

export const WithUnit: Story = {
  render: (props) => (
    <NumberField
      {...props}
      formatOptions={{
        style: "unit",
        unit: "gigabyte",
      }}
      defaultValue={12}
    >
      <Label>Storage</Label>
    </NumberField>
  ),
};

export const WithContextualHelp: Story = {
  render: (props) => (
    <NumberField {...props} minValue={5} maxValue={10}>
      <Label>
        Age
        <ContextualHelpTrigger>
          <Button ariaSlot={null} />
          <ContextualHelp>
            <Text>Enter your age</Text>
          </ContextualHelp>
        </ContextualHelpTrigger>
      </Label>
    </NumberField>
  ),
};
