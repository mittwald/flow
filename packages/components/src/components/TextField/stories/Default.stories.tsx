import type { Meta, StoryObj } from "@storybook/react";
import { TextField } from "../index";
import React from "react";
import { Label } from "@/components/Label";
import { action } from "@storybook/addon-actions";
import FieldDescription from "@/components/FieldDescription/FieldDescription";
import { Form } from "react-aria-components";
import { Button } from "@/components/Button";
import { FieldError } from "@/components/FieldError";

const meta: Meta<typeof TextField> = {
  title: "Form Controls/TextField",
  component: TextField,
  render: (props) => (
    <TextField onChange={action("onChange")} {...props}>
      <Label>First name</Label>
    </TextField>
  ),
};

export default meta;

type Story = StoryObj<typeof TextField>;

export const Default: Story = {};

export const Disabled: Story = { args: { isDisabled: true } };

export const Autofocus: Story = { args: { autoFocus: true } };

export const Required: Story = {
  args: { isRequired: true },
};

export const WithFieldDescription: Story = {
  render: (props) => (
    <TextField {...props}>
      <Label>URL</Label>
      <FieldDescription>Start with "https://"</FieldDescription>
    </TextField>
  ),
};

export const WithDefaultValue: Story = {
  render: (props) => (
    <TextField {...props} defaultValue="https://mittwald.de">
      <Label>URL</Label>
    </TextField>
  ),
};

export const WithPlaceholder: Story = {
  render: (props) => (
    <TextField {...props} placeholder="https://">
      <Label>URL</Label>
    </TextField>
  ),
};

export const WithFieldError: Story = {
  render: (props) => (
    <TextField {...props} isInvalid defaultValue="hello">
      <Label>URL</Label>
      <FieldError>Invalid input</FieldError>
      <FieldDescription>Start with "https://"</FieldDescription>
    </TextField>
  ),
};

// ToDo: submit fixen

export const WithForm: Story = {
  render: (props) => (
    <Form
      onSubmit={() => {
        // do nothing
      }}
    >
      <TextField {...props} type="email" inputMode="email" isRequired>
        <Label>Email</Label>
      </TextField>
      <br />
      <Button type="submit">Submit</Button>
    </Form>
  ),
};

export const ShowCharacterCount: Story = {
  args: { showCharacterCount: true, maxLength: 10 },
  render: (props) => (
    <TextField onChange={action("onChange")} {...props}>
      <Label>User name</Label>
    </TextField>
  ),
};
