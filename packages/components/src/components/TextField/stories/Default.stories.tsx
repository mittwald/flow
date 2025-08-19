import { Button } from "@/components/Button";
import FieldDescription from "@/components/FieldDescription/FieldDescription";
import { FieldError } from "@/components/FieldError";
import { Label } from "@/components/Label";
import { Form } from "@/integrations/react-hook-form";
import { sleep } from "@/lib/promises/sleep";
import { action } from "storybook/actions";
import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { TextField } from "../index";

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

export const WithForm: Story = {
  render: (props) => {
    const form = useForm();
    return (
      <Form form={form} onSubmit={async () => await sleep(2000)}>
        <TextField {...props} type="email" inputMode="email" isRequired>
          <Label>Email</Label>
        </TextField>
        <br />
        <Button type="submit">Submit</Button>
      </Form>
    );
  },
};

export const ShowCharacterCount: Story = {
  args: { showCharacterCount: true, maxLength: 10 },
  render: (props) => (
    <TextField onChange={action("onChange")} {...props}>
      <Label>User name</Label>
    </TextField>
  ),
};
