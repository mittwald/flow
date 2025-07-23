import type { Meta, StoryObj } from "@storybook/react";
import { Checkbox } from "../index";
import React from "react";
import { action } from "storybook/actions";

const meta: Meta<typeof Checkbox> = {
  title: "Form Controls/Checkbox",
  component: Checkbox,
  args: {
    onChange: action("onChange"),
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

export const Disabled: Story = { args: { isDisabled: true } };

export const Indeterminate: Story = { args: { isIndeterminate: true } };

export const DisabledSelected: Story = {
  args: { isDisabled: true, isSelected: true },
};
