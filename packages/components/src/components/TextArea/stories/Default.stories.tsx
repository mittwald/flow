import type { Meta, StoryObj } from "@storybook/react";
import { TextArea } from "../index";
import React from "react";
import { Label } from "@/components/Label";
import { action } from "@storybook/addon-actions";
import FieldDescription from "@/components/FieldDescription/FieldDescription";
import { Form } from "react-aria-components";
import { Button } from "@/components/Button";
import { FieldError } from "@/components/FieldError";

const meta: Meta<typeof TextArea> = {
  title: "TextArea",
  component: TextArea,
  render: (props) => (
    <TextArea onChange={action("onChange")} {...props}>
      <Label>First name</Label>
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
      <Label>URL</Label>
      <FieldDescription>Start with "https://"</FieldDescription>
    </TextArea>
  ),
};

export const WithDefaultValue: Story = {
  render: (props) => (
    <TextArea {...props} defaultValue="https://mittwald.de">
      <Label>URL</Label>
    </TextArea>
  ),
};

export const WithPlaceholder: Story = {
  render: (props) => (
    <TextArea {...props} placeholder="https://">
      <Label>URL</Label>
    </TextArea>
  ),
};

export const WithFieldError: Story = {
  render: (props) => (
    <TextArea {...props} isInvalid defaultValue="hello">
      <Label>URL</Label>
      <FieldError>Invalid input</FieldError>
      <FieldDescription>Start with "https://"</FieldDescription>
    </TextArea>
  ),
};

// ToDo: submit fixen

export const WithForm: Story = {
  render: (props) => (
    <Form onSubmit={() => {}}>
      <TextArea {...props} type="email" inputMode="email" isRequired>
        <Label>Email</Label>
      </TextArea>
      <Button style={{ marginTop: "16px" }} type="submit">
        Submit
      </Button>
    </Form>
  ),
};
