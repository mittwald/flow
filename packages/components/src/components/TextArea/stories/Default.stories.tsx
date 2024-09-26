import type { Meta, StoryObj } from "@storybook/react";
import { TextArea } from "../index";
import React from "react";
import { Label } from "@/components/Label";
import { action } from "@storybook/addon-actions";
import FieldDescription from "@/components/FieldDescription/FieldDescription";
import { FieldError } from "@/components/FieldError";

const meta: Meta<typeof TextArea> = {
  title: "Form Controls/TextArea",
  component: TextArea,
  render: (props) => (
    <TextArea onChange={action("onChange")} {...props}>
      <Label>Message</Label>
    </TextArea>
  ),
};

export default meta;

type Story = StoryObj<typeof TextArea>;

export const Default: Story = {};

export const Disabled: Story = { args: { isDisabled: true } };

export const Required: Story = {
  args: { isRequired: true },
};

export const WithFieldDescription: Story = {
  render: (props) => (
    <TextArea {...props}>
      <Label>Public Key</Label>
      <FieldDescription>Starts with ssh-rsa</FieldDescription>
    </TextArea>
  ),
};

export const WithDefaultValue: Story = {
  render: (props) => (
    <TextArea
      {...props}
      defaultValue="ssh-rsa asdfkehbahrgvszuagfdashdfgsaghdfiuadsf"
    >
      <Label>Public Key</Label>
    </TextArea>
  ),
};

export const WithPlaceholder: Story = {
  render: (props) => (
    <TextArea {...props} placeholder="ssh-rsa...">
      <Label>Public Key</Label>
    </TextArea>
  ),
};

export const WithFieldError: Story = {
  render: (props) => (
    <TextArea {...props} isInvalid defaultValue="hello">
      <Label>Public Key</Label>
      <FieldError>Invalid Key</FieldError>
    </TextArea>
  ),
};

export const ShowCharacterCount: Story = {
  args: { showCharacterCount: true, maxLength: 100 },
};

export const Resizeable: Story = {
  args: { rows: 1, autoResizeMaxRows: 5 },
};
