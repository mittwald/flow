import type { Meta, StoryObj } from "@storybook/react";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { action } from "storybook/actions";
import { Label } from "@/components/Label";
import { Field, Form, typedField } from "@/integrations/react-hook-form";
import { Button } from "@/components/Button";
import { Section } from "@/components/Section";
import { ActionGroup } from "@/components/ActionGroup";
import { sleep } from "@/lib/promises/sleep";
import { PasswordCreationField } from "@/components/PasswordCreationField";
import {
  generatePasswordCreationFieldValidation,
  type PolicyDeclaration,
  RuleType,
  SequenceType,
} from "@/integrations/@mittwald/password-tools-js";
import { FieldError } from "@/components/FieldError";

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
          <Field
            name="user"
            rules={{
              required: true,
              validate: generatePasswordCreationFieldValidation(),
            }}
          >
            <PasswordCreationField>
              <Label>Password</Label>
              <Button>asd</Button>
            </PasswordCreationField>
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

export const WithForm: Story = {
  render: () => {
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
            validate: generatePasswordCreationFieldValidation(policyDecl),
          }}
          name="password"
        >
          <PasswordCreationField validationPolicy={policyDecl}>
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

export const WithFieldError: Story = {
  render: () => {
    const form = useForm({
      defaultValues: {
        field: "",
      },
    });
    useEffect(() => {
      form.setError("field", {
        type: "required",
        message: "ErrorFromForm",
      });
    }, []);

    return (
      <Form form={form} onSubmit={async () => await sleep(2000)}>
        <Field name="field">
          <PasswordCreationField>
            <Label>Password</Label>
            <Button>asd</Button>
          </PasswordCreationField>
        </Field>
        <PasswordCreationField defaultValue={""} isInvalid>
          <Label>Password</Label>
          <Button>asd</Button>
          <FieldError>ErrorFromOuterFieldError!</FieldError>
        </PasswordCreationField>
        <PasswordCreationField defaultValue={""}>
          <Label>Password</Label>
          <Button>asd</Button>
        </PasswordCreationField>
      </Form>
    );
  },
};

export const WithFocus: Story = {
  render: () => {
    const form = useForm({
      defaultValues: {
        field: "",
      },
    });
    return (
      <Form form={form} onSubmit={async () => await sleep(2000)}>
        <Field name={"field"}>
          <PasswordCreationField>
            <Label>Password</Label>
            <Button>asd</Button>
          </PasswordCreationField>
        </Field>
        <div style={{ marginBottom: "2200px" }} />
        <Button
          onPress={() =>
            form.setError(
              "field",
              { type: "required", message: "oh no" },
              { shouldFocus: true },
            )
          }
        >
          err through form
        </Button>
        <Button onPress={() => form.setFocus("field")}>
          focus through form
        </Button>
        <Button type="submit">Submit</Button>
      </Form>
    );
  },
};
