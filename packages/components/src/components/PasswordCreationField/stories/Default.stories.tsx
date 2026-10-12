import type { Meta, StoryObj } from "@storybook/react-vite";
import { PasswordCreationField } from "../index";
import { useState } from "react";
import { Label } from "@/components/Label";
import { action } from "storybook/actions";
import { Button } from "@/components/Button";
import { IconDanger } from "@/components/Icon/components/icons";
import { CopyButton } from "@/components/CopyButton";
import { FieldError } from "@/components/FieldError";

const meta: Meta<typeof PasswordCreationField> = {
  title: "Form Controls/PasswordCreationField",
  component: PasswordCreationField,
  args: {
    isDisabled: false,
    isReadOnly: false,
    isRequired: false,
  },
  render: (props) => {
    const [value, setValue] = useState("");

    return (
      <PasswordCreationField
        value={value}
        onValidationResult={action("onValidationResult")}
        onChange={(password) => {
          action("onChange");
          setValue(password);
        }}
        {...props}
      >
        <Label>Password</Label>
      </PasswordCreationField>
    );
  },
};
export default meta;

type Story = StoryObj<typeof PasswordCreationField>;

export const Default: Story = {};

export const WithPlaceholder: Story = {
  args: { placeholder: "useTheForce" },
};

export const WithCustomButton: Story = {
  render: (props) => {
    return (
      <PasswordCreationField {...props}>
        <Label>Password</Label>
        <Button aria-label="Custom Button">
          <IconDanger />
        </Button>
      </PasswordCreationField>
    );
  },
};

export const WithCopyButton: Story = {
  render: (props) => {
    const [password, setPassword] = useState<string>("");

    return (
      <PasswordCreationField onChange={(v) => setPassword(v)} {...props}>
        <Label>Password</Label>
        <CopyButton text={password} />
      </PasswordCreationField>
    );
  },
};

// A server error for the submitted password, shown until the password changes.
export const WithFieldError: Story = {
  render: (props) => {
    const [value, setValue] = useState("Imperial-March-1977!");
    const [error, setError] = useState<string>(
      "This password was already used on the Death Star",
    );

    return (
      <PasswordCreationField
        {...props}
        value={value}
        onChange={(password) => {
          setValue(password);
          setError("");
        }}
        isInvalid={!!error}
      >
        <Label>Password</Label>
        <FieldError>{error}</FieldError>
      </PasswordCreationField>
    );
  },
};
