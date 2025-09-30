import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { useForm } from "react-hook-form";
import { action } from "storybook/actions";
import { Label } from "@/components/Label";
import { Field, Form, typedField } from "@/integrations/react-hook-form";
import { Button } from "@/components/Button";
import { Section } from "@/components/Section";
import { ActionGroup } from "@/components/ActionGroup";
import { sleep } from "@/lib/promises/sleep";
import { SearchField } from "@/components/SearchField";
import { PasswordCreationField } from "@/components/PasswordCreationField";
import { Policy } from "@mittwald/password-tools-js/policy";
import {
  generatePasswordCreationFieldValidation,
  type PolicyDeclaration,
  RuleType,
  SequenceType,
} from "@/integrations/@mittwald/password-tools-js";

const submitAction = action("submit");

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
      pattern: "^[0-9]",
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
      identifier: "numbers",
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

const meta: Meta<typeof Field> = {
  title: "Integrations/React Hook Form/PasswordCreationField",
  component: Field,
  render: () => {
    interface Values {
      user: string;
    }

    const handleOnSubmit = async (values: Values) => {
      await sleep(1000);
      submitAction(values);
    };

    const form = useForm<Values>({
      defaultValues: {
        user: "",
      },
    });

    const Field = typedField(form);

    return (
      <Form form={form} onSubmit={handleOnSubmit}>
        <Section>
          <Field name="user">
            <SearchField>
              <Label>Suche</Label>
            </SearchField>
          </Field>

          <ActionGroup>
            <Button type="submit">Submit</Button>
          </ActionGroup>
        </Section>
      </Form>
    );
  },
};
export default meta;

type Story = StoryObj<typeof Field>;

export const Default: Story = {};

export const WithFocusAndError: Story = {
  render: () => {
    const form = useForm();

    return (
      <Form form={form} onSubmit={async () => await sleep(2000)}>
        <Field name={"text"} rules={{ required: true }}>
          <PasswordCreationField validationPolicy={policyDecl}>
            <Label>Password</Label>
            <Button>asd</Button>
          </PasswordCreationField>
        </Field>
        <div style={{ marginBottom: "2200px" }} />
        <Button
          onPress={() =>
            form.setError(
              "text",
              { type: "required", message: "oh no" },
              { shouldFocus: true },
            )
          }
        >
          err through form
        </Button>
        <Button onPress={() => form.setFocus("text")}>
          focus through form
        </Button>
        <Button type="submit">Submit</Button>
      </Form>
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
