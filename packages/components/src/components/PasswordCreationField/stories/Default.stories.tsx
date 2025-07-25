import type { Meta, StoryObj } from "@storybook/react";
import {
  generatePasswordCreationFieldValidation,
  PasswordCreationField,
} from "../index";
import React, { useState } from "react";
import { Label } from "@/components/Label";
import { action } from "storybook/actions";
import type { PolicyDeclaration } from "@mittwald/password-tools-js/policy";
import { RuleType, SequenceType } from "@mittwald/password-tools-js/rules";
import { Policy } from "@mittwald/password-tools-js/policy";
import { useForm } from "react-hook-form";
import { sleep } from "@/lib/promises/sleep";
import { Button } from "@/components/Button";
import { Field, Form } from "@/integrations/react-hook-form";
import { IconDanger } from "@/components/Icon/components/icons";
import { CopyButton } from "@/components/CopyButton";

const policyDecl: PolicyDeclaration = {
  minComplexity: 3,
  rules: [
    {
      ruleType: RuleType.length,
      min: 8,
      max: 12,
    },
    {
      ruleType: RuleType.sequence,
      sequences: [SequenceType.number],
      maxLength: 2,
    },
    {
      ruleType: RuleType.regex,
      pattern: "[A-B]",
      min: 1,
      max: 2,
    },
    {
      ruleType: RuleType.regex,
      pattern: "^[A-Za-z0-9]",
      translationKey: "canNotStartWithSpecialCharacter",
    },
    {
      ruleType: RuleType.hibp,
    },
    {
      identifier: "special",
      ruleType: RuleType.charPool,
      charPools: ["special"],
      min: 1,
      max: 2,
    },
    {
      ruleType: RuleType.regex,
      pattern: "[-_§$%&/=,;.#]",
      translationKey: "asd",
      min: 1,
    },
  ],
};

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

export const WithForm: Story = {
  render: () => {
    const customPolicy = Policy.fromDeclaration(policyDecl);
    const form = useForm({
      defaultValues: {
        password: "",
      },
    });

    return (
      <Form
        form={form}
        onSubmit={async (values) => {
          await sleep(2000);
          console.log("submitted", values);
        }}
      >
        <Field
          rules={{
            required: true,
            validate: generatePasswordCreationFieldValidation(customPolicy),
          }}
          name="password"
        >
          <PasswordCreationField validationPolicy={customPolicy}>
            <Label>Password</Label>
            <Button>asd</Button>
          </PasswordCreationField>
        </Field>
        <br />
        <Button onPress={() => form.reset()}>Reset</Button>
        <Button type="submit">Submit</Button>
      </Form>
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
