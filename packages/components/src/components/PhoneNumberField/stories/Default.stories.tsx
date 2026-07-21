import { FieldDescription } from "@/components/FieldDescription";
import { FieldError } from "@/components/FieldError";
import { Label } from "@/components/Label";
import { Text } from "@/components/Text";
import { action } from "storybook/actions";
import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { PhoneNumberField } from "../index";

const meta: Meta<typeof PhoneNumberField> = {
  title: "Form Controls/PhoneNumberField",
  component: PhoneNumberField,
  args: {
    isDisabled: false,
    isReadOnly: false,
    isRequired: false,
    defaultCountry: "DE",
  },
  render: (props) => (
    <PhoneNumberField onChange={action("onChange")} {...props}>
      <Label>Phone number</Label>
      <FieldError />
    </PhoneNumberField>
  ),
};

export default meta;

type Story = StoryObj<typeof PhoneNumberField>;

export const Default: Story = {};

export const WithDefaultValue: Story = {
  render: (props) => (
    <PhoneNumberField {...props} defaultValue="+495772293100">
      <Label>Phone number</Label>
      <FieldError />
    </PhoneNumberField>
  ),
};

export const WithFieldDescription: Story = {
  render: (props) => (
    <PhoneNumberField {...props}>
      <Label>Phone number</Label>
      <FieldDescription>
        National numbers are interpreted as German (+49)
      </FieldDescription>
      <FieldError />
    </PhoneNumberField>
  ),
};

export const WithControlledValue: Story = {
  render: (props) => {
    const [value, setValue] = useState("");

    return (
      <>
        <PhoneNumberField {...props} value={value} onChange={setValue}>
          <Label>Phone number</Label>
          <FieldError />
        </PhoneNumberField>
        <Text>Value: {value}</Text>
      </>
    );
  },
};

export const OtherDefaultCountry: Story = {
  args: { defaultCountry: "AT" },
  render: (props) => (
    <PhoneNumberField {...props}>
      <Label>Phone number (AT)</Label>
      <FieldError />
    </PhoneNumberField>
  ),
};
