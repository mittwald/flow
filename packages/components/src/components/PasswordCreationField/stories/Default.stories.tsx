import type { Meta, StoryObj } from "@storybook/react";
import { PasswordCreationField } from "../index";
import React from "react";
import { Label } from "@/components/Label";
import { action } from "@storybook/addon-actions";
import { IconPlus } from "@/components/Icon/components/icons";
import Button from "@/components/Button";
import { Form } from "react-aria-components";
import type { PolicyDeclaration } from "@mittwald/password-validation/policy";
import { RuleType, SequenceType } from "@mittwald/password-validation/rules";
import { Policy } from "@mittwald/password-validation/policy";
import { Action } from "@/components/Action";

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
      ruleType: RuleType.hibp,
    },
    {
      identifier: "specialChars",
      ruleType: RuleType.charPool,
      charPools: ["special"],
      min: 1,
      max: 2,
    },
    {
      identifier: "numberChars",
      ruleType: RuleType.charPool,
      charPools: ["numbers"],
      min: 1,
      max: 2,
    },
    {
      ruleType: RuleType.blocklist,
      blocklist: ["foo", "bar"],
      substringMatch: true,
    },
  ],
};

const meta: Meta<typeof PasswordCreationField> = {
  title: "Form Controls/PasswordCreationField",
  component: PasswordCreationField,
  render: (props) => {
    return (
      <PasswordCreationField onChange={action("onChange")} {...props}>
        <Label>Password</Label>
        <Action action={action("customButton")}>
          <Button slot="button" size="m" aria-label="Add ">
            <IconPlus />
          </Button>
        </Action>
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

export const WithForm: Story = {
  render: (props) => {
    const policy = Policy.fromDeclaration(policyDecl);

    return (
      <Form
        onSubmit={() => {
          // do nothing
        }}
      >
        <PasswordCreationField validationPolicy={policy}>
          <Label>Password</Label>
        </PasswordCreationField>
      </Form>
    );
  },
};
