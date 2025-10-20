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
import { CheckboxGroup } from "@/components/CheckboxGroup";
import { Checkbox } from "@/components/Checkbox";
import { FieldDescription } from "@/components/FieldDescription";
import { FieldError } from "@/components/FieldError";

const submitAction = action("submit");

const meta: Meta<typeof Field> = {
  title: "Integrations/React Hook Form/CheckboxGroup",
  component: Field,
  render: () => {
    interface Values {
      interests: string[];
      interestsDefaultValue: string[];
      interestsRequired: string[];
      interestsMaxValue: string[];
    }

    const handleOnSubmit = async (values: Values) => {
      await sleep(1500);
      submitAction(values);
    };

    const form = useForm<Values>({
      defaultValues: {
        interests: [],
        interestsDefaultValue: ["foo"],
        interestsRequired: [],
        interestsMaxValue: [],
      },
    });

    const Field = typedField(form);

    return (
      <Form form={form} onSubmit={handleOnSubmit}>
        <Section>
          <Field name="interests">
            <CheckboxGroup>
              <Label>Interests</Label>
              <Checkbox value="foo">Foo</Checkbox>
              <Checkbox value="bar">Bar</Checkbox>
              <Checkbox value="baz">Baz</Checkbox>
            </CheckboxGroup>
          </Field>

          <Field name="interestsDefaultValue">
            <CheckboxGroup>
              <Label>Interests</Label>
              <Checkbox value="foo">Foo</Checkbox>
              <Checkbox value="bar">Bar</Checkbox>
              <Checkbox value="baz">Baz</Checkbox>
            </CheckboxGroup>
          </Field>

          <Field
            name="interestsRequired"
            rules={{
              validate: {
                min: (val) =>
                  Array.isArray(val) && val.length > 0
                    ? true
                    : "Check at least 1 item",
              },
            }}
          >
            <CheckboxGroup>
              <Label>Interests</Label>
              <Checkbox value="foo">Foo</Checkbox>
              <Checkbox value="bar">Bar</Checkbox>
              <Checkbox value="baz">Baz</Checkbox>
              <FieldDescription>Check at least 1 item</FieldDescription>
            </CheckboxGroup>
          </Field>

          <Field
            name="interestsMaxValue"
            rules={{
              validate: {
                max: (val) =>
                  Array.isArray(val) && val.length < 3
                    ? true
                    : "Check max 2 items",
              },
            }}
          >
            <CheckboxGroup>
              <Label>Interests</Label>
              <Checkbox value="foo">Foo</Checkbox>
              <Checkbox value="bar">Bar</Checkbox>
              <Checkbox value="baz">Baz</Checkbox>
              <FieldDescription>Check max 2 items</FieldDescription>
            </CheckboxGroup>
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

export const WithFieldError: Story = {
  render: (props) => {
    const form = useForm();
    useEffect(() => {
      form.setError("field", {
        type: "required",
        message: "ErrorFromForm",
      });
    }, []);

    return (
      <Form form={form} onSubmit={async () => await sleep(2000)}>
        <Field name={"field"}>
          <CheckboxGroup l={[1, 1, 1]} m={[1, 1]} {...props}>
            <Label>Options</Label>
            <Checkbox value="1">Option 1</Checkbox>
            <Checkbox value="2">Option 2</Checkbox>
            <Checkbox value="3">Option 3</Checkbox>
            <Checkbox value="4">Option 4</Checkbox>
            <Checkbox value="5">Option 5</Checkbox>
            <Checkbox value="6">Option 6</Checkbox>
          </CheckboxGroup>
        </Field>
        <CheckboxGroup l={[1, 1, 1]} m={[1, 1]} isInvalid {...props}>
          <Label>Options</Label>
          <Checkbox value="1">Option 1</Checkbox>
          <Checkbox value="2">Option 2</Checkbox>
          <Checkbox value="3">Option 3</Checkbox>
          <Checkbox value="4">Option 4</Checkbox>
          <Checkbox value="5">Option 5</Checkbox>
          <Checkbox value="6">Option 6</Checkbox>
          <FieldError>ErrorFromOuterFieldError!</FieldError>
        </CheckboxGroup>
      </Form>
    );
  },
};

export const WithFocus: Story = {
  render: (props) => {
    const form = useForm();
    return (
      <Form form={form} onSubmit={async () => await sleep(2000)}>
        <Field name={"field"}>
          <CheckboxGroup l={[1, 1, 1]} m={[1, 1]} {...props}>
            <Label>Options</Label>
            <Checkbox value="1">Option 1</Checkbox>
            <Checkbox value="2">Option 2</Checkbox>
            <Checkbox value="3">Option 3</Checkbox>
            <Checkbox value="4">Option 4</Checkbox>
            <Checkbox value="5">Option 5</Checkbox>
            <Checkbox value="6">Option 6</Checkbox>
          </CheckboxGroup>
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
