import FieldDescription from "@/components/FieldDescription/FieldDescription";
import { FieldError } from "@/components/FieldError";
import { Label } from "@/components/Label";
import { action } from "storybook/actions";
import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { TextField } from "../index";
import { Button } from "@/components/Button";
import { IconStar } from "@/components/Icon/components/icons";

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
export const ReadOnly: Story = { args: { isReadOnly: true } };

export const Required: Story = { args: { isRequired: true } };

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

export const WithControlledValue: Story = {
  render: (props) => {
    const [value, setValue] = useState("");

    return (
      <TextField
        {...props}
        value={value}
        onChange={(val) => setValue(val.toUpperCase())}
      >
        <Label>URL</Label>
      </TextField>
    );
  },
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

export const ShowCharacterCount: Story = {
  args: { showCharacterCount: true, maxLength: 10 },
  render: (props) => (
    <TextField onChange={action("onChange")} {...props}>
      <Label>User name</Label>
    </TextField>
  ),
};

export const Password: Story = {
  args: { type: "password" },
  render: (props) => (
    <TextField {...props}>
      <Label>Password</Label>
    </TextField>
  ),
};

export const CustomButton: Story = {
  render: (props) => (
    <TextField {...props}>
      <Label>Custom Button</Label>
      <Button aria-label="Custom">
        <IconStar />
      </Button>
    </TextField>
  ),
};
