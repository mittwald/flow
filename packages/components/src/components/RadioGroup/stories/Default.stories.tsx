import type { Meta, StoryObj } from "@storybook/react";
import { Radio, RadioGroup } from "../index";
import React from "react";
import { Label } from "@/components/Label";
import { action } from "@storybook/addon-actions";
import { FieldError } from "@/components/FieldError";

const meta: Meta<typeof RadioGroup> = {
  title: "Form Controls/RadioGroup",
  component: RadioGroup,
  args: {
    onChange: action("onChange"),
  },
  parameters: {
    controls: { exclude: ["onChange"] },
  },
  render: (props) => (
    <RadioGroup {...props} defaultValue="admin">
      <Label>Role</Label>
      <Radio value="admin">Admin</Radio>
      <Radio value="member">Member</Radio>
      <Radio value="accountant">Accountant</Radio>
    </RadioGroup>
  ),
};

export default meta;

type Story = StoryObj<typeof RadioGroup>;

export const Default: Story = {};

export const RadioGroupDisabled: Story = {
  args: {
    isDisabled: true,
  },
};

export const RadioDisabled: Story = {
  render: (props) => (
    <RadioGroup {...props} defaultValue="admin">
      <Label>Role</Label>
      <Radio value="admin">Admin</Radio>
      <Radio value="member" isDisabled>
        Member
      </Radio>
      <Radio value="accountant">Accountant</Radio>
    </RadioGroup>
  ),
};

export const WithFieldError: Story = {
  render: (props) => (
    <RadioGroup {...props} isInvalid isRequired>
      <Label>App</Label>
      <Radio value="wordpress">WordPress</Radio>
      <Radio value="typo3">TYPO3</Radio>
      <Radio value="magento">Magento</Radio>
      <FieldError>Select an app to continue</FieldError>
    </RadioGroup>
  ),
};
