import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { Label } from "@/components/Label";
import { Option } from "@/components/Options";
import FieldDescription from "@/components/FieldDescription";
import { FieldError } from "@/components/FieldError";
import { ComboBox } from "src/components/ComboBox";

const meta: Meta<typeof ComboBox> = {
  title: "Form Controls/ComboBox",
  component: ComboBox,
  render: (props) => (
    <ComboBox {...props}>
      <Label>Domain</Label>
      <Option>mydomain.de</Option>
      <Option>shop.mydomain.de</Option>
      <Option>anotherdomain.com</Option>
      <Option>www.anotherdomain.com</Option>
      <Option>anotherdomain.com/shop</Option>
      <Option>anotherdomain.com/blog</Option>
      <Option>onemoredomain.de</Option>
      <Option>www.onemoredomain.de</Option>
    </ComboBox>
  ),
};
export default meta;

type Story = StoryObj<typeof ComboBox>;

export const Default: Story = {};

export const Disabled: Story = { args: { isDisabled: true } };

export const Required: Story = {
  args: { isRequired: true },
};

export const WithFieldDescription: Story = {
  render: (props) => (
    <ComboBox {...props}>
      <Label>Domain</Label>
      <Option>mydomain.de</Option>
      <Option>shop.mydomain.de</Option>
      <Option>anotherdomain.com</Option>
      <Option>www.anotherdomain.com</Option>
      <Option>anotherdomain.com/shop</Option>
      <Option>anotherdomain.com/blog</Option>
      <Option>onemoredomain.de</Option>
      <Option>www.onemoredomain.de</Option>
      <FieldDescription>Select a domain</FieldDescription>
    </ComboBox>
  ),
};

export const WithDefaultValue: Story = {
  render: (props) => (
    <ComboBox {...props} defaultSelectedKey="mydomain.de">
      <Label>Domain</Label>
      <Option value="mydomain.de">mydomain.de</Option>
      <Option>shop.mydomain.de</Option>
      <Option>anotherdomain.com</Option>
      <Option>www.anotherdomain.com</Option>
      <Option>anotherdomain.com/shop</Option>
      <Option>anotherdomain.com/blog</Option>
      <Option>onemoredomain.de</Option>
      <Option>www.onemoredomain.de</Option>
    </ComboBox>
  ),
};

export const WithFieldError: Story = {
  render: (props) => (
    <ComboBox {...props} isInvalid isRequired>
      <Label>Domain</Label>
      <Option>mydomain.de</Option>
      <Option>shop.mydomain.de</Option>
      <Option>anotherdomain.com</Option>
      <Option>www.anotherdomain.com</Option>
      <Option>anotherdomain.com/shop</Option>
      <Option>anotherdomain.com/blog</Option>
      <Option>onemoredomain.de</Option>
      <Option>www.onemoredomain.de</Option>
      <FieldError>Select a domain to continue</FieldError>
    </ComboBox>
  ),
};
