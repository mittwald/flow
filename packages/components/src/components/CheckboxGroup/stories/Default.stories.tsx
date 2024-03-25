import type { Meta, StoryObj } from "@storybook/react";
import { CheckboxGroup } from "../index";
import React from "react";
import { Label } from "@/components/Label";
import { action } from "@storybook/addon-actions";
import { FieldError } from "@/components/FieldError";
import { Checkbox } from "@/components/Checkbox";

const meta: Meta<typeof CheckboxGroup> = {
  title: "Form Controls/CheckboxGroup",
  component: CheckboxGroup,
  args: {
    onChange: action("onChange"),
  },
  parameters: {
    controls: { exclude: ["onChange"] },
  },
  render: (props) => (
    <CheckboxGroup {...props}>
      <Label>Permissions</Label>
      <Checkbox value="read">Read</Checkbox>
      <Checkbox value="write">Write</Checkbox>
    </CheckboxGroup>
  ),
};

export default meta;

type Story = StoryObj<typeof CheckboxGroup>;

export const Default: Story = {};

export const CheckboxGroupDisabled: Story = {
  args: {
    isDisabled: true,
  },
};

export const CheckboxDisabled: Story = {
  render: (props) => (
    <CheckboxGroup {...props}>
      <Label>Permissions</Label>
      <Checkbox value="read" isDisabled>
        Read
      </Checkbox>
      <Checkbox value="write">Write</Checkbox>
    </CheckboxGroup>
  ),
};

export const WithFieldError: Story = {
  render: (props) => (
    <CheckboxGroup {...props} isInvalid isRequired>
      <Label>Permissions</Label>
      <Checkbox value="read">Read</Checkbox>
      <Checkbox value="write">Write</Checkbox>
      <FieldError>Select at least one to continue</FieldError>
    </CheckboxGroup>
  ),
};
