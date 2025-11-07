import type { Meta, StoryObj } from "@storybook/react";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { action } from "storybook/actions";
import { Label } from "@/components/Label";
import {
  Field,
  Form,
  ResetButton,
  SubmitButton,
  typedField,
} from "@/integrations/react-hook-form";
import { Button } from "@/components/Button";
import { Section } from "@/components/Section";
import { ActionGroup } from "@/components/ActionGroup";
import { sleep } from "@/lib/promises/sleep";
import { Slider } from "@/components/Slider";
import { FieldError } from "@/components/FieldError";

const submitAction = action("submit");

const meta: Meta<typeof Field> = {
  title: "Integrations/React Hook Form/Slider",
  component: Field,
  render: () => {
    interface Values {
      storage: number;
    }

    const handleOnSubmit = async (values: Values) => {
      await sleep(1500);
      submitAction(values);
    };

    const form = useForm<Values>({
      defaultValues: {
        storage: 50,
      },
    });

    const Field = typedField(form);

    return (
      <Form form={form} onSubmit={handleOnSubmit}>
        <Section>
          <Field name="storage">
            <Slider
              formatOptions={{
                style: "unit",
                unit: "gigabyte",
              }}
              minValue={10}
              maxValue={100}
            >
              <Label>Storage</Label>
            </Slider>
          </Field>

          <ActionGroup>
            <ResetButton>Reset</ResetButton>
            <SubmitButton>Submit</SubmitButton>
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
  render: () => {
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
          <Slider
            formatOptions={{
              style: "unit",
              unit: "gigabyte",
            }}
            minValue={10}
            maxValue={100}
          >
            <Label>Storage</Label>
          </Slider>
        </Field>
        <Slider
          formatOptions={{
            style: "unit",
            unit: "gigabyte",
          }}
          minValue={10}
          maxValue={100}
          isInvalid
        >
          <Label>Storage</Label>
          <Label>Field</Label>
          <FieldError>ErrorFromOuterFieldError!</FieldError>
        </Slider>
      </Form>
    );
  },
};

export const WithFocus: Story = {
  render: () => {
    const form = useForm();
    return (
      <Form form={form} onSubmit={async () => await sleep(2000)}>
        <Field name={"field"}>
          <Slider
            formatOptions={{
              style: "unit",
              unit: "gigabyte",
            }}
            minValue={10}
            maxValue={100}
          >
            <Label>Storage</Label>
          </Slider>
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
        <ResetButton>Reset</ResetButton>
        <SubmitButton>Submit</SubmitButton>
      </Form>
    );
  },
};
