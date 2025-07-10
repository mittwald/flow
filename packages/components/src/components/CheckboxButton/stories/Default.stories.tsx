import type { Meta, StoryObj } from "@storybook/react";
import { CheckboxButton } from "../index";
import React from "react";
import { action } from "storybook/actions";
import Content from "@/components/Content";
import Text from "@/components/Text";

const meta: Meta<typeof CheckboxButton> = {
  title: "Form Controls/CheckboxButton",
  component: CheckboxButton,
  args: {
    onChange: action("onChange"),
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

export const Disabled: Story = { args: { isDisabled: true } };

export const Indeterminate: Story = { args: { isIndeterminate: true } };

export const DisabledSelected: Story = {
  args: { isDisabled: true, isSelected: true },
};

export const WithContent: Story = {
  render: (props) => (
    <CheckboxButton {...props}>
      <Text>Terms and Conditions</Text>
      <Content>Consent to terms and conditions</Content>
    </CheckboxButton>
  ),
};

export const Invalid: Story = {
  args: { isInvalid: true },
};
