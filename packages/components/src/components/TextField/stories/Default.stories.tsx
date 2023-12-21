import type { Meta, StoryObj } from "@storybook/react";
import { TextField } from "../index";
import React from "react";
import { Label } from "@/components/Label";
import { action } from "@storybook/addon-actions";
import FieldDescription from "@/components/FieldDescription/FieldDescription";
import { Form } from "react-aria-components";
import { Button } from "@/components/Button";

const meta: Meta<typeof TextField> = {
  title: "TextField",
  component: TextField,
  args: {
    onChange: action("onChange"),
  },
  render: (props) => (
    <TextField {...props} defaultValue="John">
      <Label>First name</Label>
    </TextField>
  ),
};

export default meta;

type Story = StoryObj<typeof TextField>;

export const Default: Story = {};

export const Disabled: Story = { args: { isDisabled: true } };

export const WithFieldDescription: Story = {
  render: (props) => (
    <TextField {...props} defaultValue="https://mittwald.de">
      <Label>URL</Label>
      <FieldDescription>Start with "https://"</FieldDescription>
    </TextField>
  ),
};

export const Invalid: Story = {
  render: (props) => (
    <TextField
      {...props}
      isInvalid
      errorMessage="Invalid input"
      defaultValue="hello"
    >
      <Label>URL</Label>
      <FieldDescription>Start with "https://"</FieldDescription>
    </TextField>
  ),
};

// ToDo: submit fixen

export const WithForm: Story = {
  render: (props) => (
    <Form onSubmit={() => {}}>
      <TextField {...props} type="email" inputMode="email" isRequired>
        <Label>Email</Label>
      </TextField>
      <Button style={{ marginTop: "16px" }} type="submit">
        Submit
      </Button>
    </Form>
  ),
};
