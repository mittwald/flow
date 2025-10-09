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
import { NumberField } from "@/components/NumberField";
import { FieldDescription } from "@/components/FieldDescription";

const submitAction = action("submit");

const meta: Meta<typeof Field> = {
  title: "Integrations/React Hook Form/NumberField",
  component: Field,
  render: () => {
    interface Values {
      age: number;
      ageDefaultValue: number;
      ageRequired: number;
      ageMinValue: number;
    }

    const handleOnSubmit = async (values: Values) => {
      await sleep(1500);
      submitAction(values);
    };

    const form = useForm<Values>({
      defaultValues: {
        ageDefaultValue: 36,
      },
    });

    const Field = typedField(form);

    return (
      <Form form={form} onSubmit={handleOnSubmit}>
        <Section>
          <Field name="age">
            <NumberField>
              <Label>Age</Label>
            </NumberField>
          </Field>

          <Field name="ageDefaultValue">
            <NumberField>
              <Label>Age</Label>
            </NumberField>
          </Field>

          <Field
            name="ageRequired"
            rules={{ required: "Please enter your age" }}
          >
            <NumberField>
              <Label>Age</Label>
            </NumberField>
          </Field>

          <Field
            name="ageMinValue"
            rules={{ required: "Please enter your age" }}
          >
            <NumberField minValue={18}>
              <Label>Age</Label>
              <FieldDescription>
                You have to be at least 18 years old
              </FieldDescription>
            </NumberField>
          </Field>

          <ActionGroup>
            <Button onPress={() => form.reset()}>Reset</Button>
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
          <NumberField>
            <Label>Age</Label>
          </NumberField>
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
