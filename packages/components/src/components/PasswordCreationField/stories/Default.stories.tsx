import type { Meta, StoryObj } from "@storybook/react";
import { PasswordCreationField } from "../index";
import React, { useState } from "react";
import { Label } from "@/components/Label";
import { action } from "storybook/actions";
import { Button } from "@/components/Button";
import { IconDanger } from "@/components/Icon/components/icons";
import { CopyButton } from "@/components/CopyButton";

const meta: Meta<typeof PasswordCreationField> = {
  title: "Form Controls/PasswordCreationField",
  component: PasswordCreationField,
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

export const Disabled: Story = { args: { isDisabled: true } };

export const Required: Story = {
  args: { isRequired: true },
};

export const WithPlaceholder: Story = {
  args: { placeholder: "helloMoto" },
};

export const WithCustomButtons: Story = {
  render: (props) => {
    return (
      <PasswordCreationField {...props}>
        <Label>Password</Label>
        <Button>
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
