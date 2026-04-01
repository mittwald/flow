import type { Meta, StoryObj } from "@storybook/react";
import { CheckboxButton } from "../index";
import { action } from "storybook/actions";
import Content from "@/components/Content";
import Text from "@/components/Text";
import { FieldError } from "@/components/FieldError";
import React from "react";

const meta: Meta<typeof CheckboxButton> = {
  title: "Form Controls/CheckboxButton",
  component: CheckboxButton,
  args: {
    onChange: action("onChange"),
    isDisabled: false,
    isReadOnly: false,
    isIndeterminate: false,
  },
  parameters: {
    controls: { exclude: ["onChange"] },
  },
  render: (props) => (
    <CheckboxButton {...props}>Consent to terms and conditions</CheckboxButton>
  ),
};

export default meta;

type Story = StoryObj<typeof CheckboxButton>;

export const Default: Story = {};

export const WithContent: Story = {
  render: (props) => (
    <CheckboxButton {...props}>
      <Text>Terms and Conditions</Text>
      <Content>Consent to terms and conditions</Content>
    </CheckboxButton>
  ),
};

export const WithFieldError: Story = {
  render: (props) => (
    <CheckboxButton {...props} isInvalid>
      Consent to terms and conditions
      <FieldError>Please consent</FieldError>
    </CheckboxButton>
  ),
};
