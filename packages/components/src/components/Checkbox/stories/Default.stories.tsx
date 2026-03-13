import type { Meta, StoryObj } from "@storybook/react";
import { Checkbox } from "../index";
import React from "react";
import { action } from "storybook/actions";
import { FieldError } from "@/components/FieldError";

const meta: Meta<typeof Checkbox> = {
  title: "Form Controls/Checkbox",
  component: Checkbox,
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
    <Checkbox {...props}>Consent to terms and conditions</Checkbox>
  ),
};

export default meta;

type Story = StoryObj<typeof Checkbox>;

export const Default: Story = {};

export const WithFieldError: Story = {
  render: (props) => (
    <Checkbox {...props} isInvalid>
      Consent to terms and conditions
      <FieldError>Please consent</FieldError>
    </Checkbox>
  ),
};
