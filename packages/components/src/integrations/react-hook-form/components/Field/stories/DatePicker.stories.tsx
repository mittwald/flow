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
import { type CalendarDate, parseDate } from "@internationalized/date";
import { getLocalTimeZone, today } from "@internationalized/date";
import DatePicker from "@/components/DatePicker";
import { FieldError } from "@/components/FieldError";

const submitAction = action("submit");

const meta: Meta<typeof Field> = {
  title: "Integrations/React Hook Form/DatePicker",
  component: Field,
  render: () => {
    interface Values {
      date: CalendarDate;
      dateDefaultValue: CalendarDate;
      dateRequired: CalendarDate;
      dateMinValue: CalendarDate;
    }

    const handleOnSubmit = async (values: Values) => {
      await sleep(1500);
      submitAction(values);
    };

    const form = useForm<Values>({
      defaultValues: {
        dateDefaultValue: parseDate("2025-09-01"),
      },
    });

    const Field = typedField(form);

    return (
      <Form form={form} onSubmit={handleOnSubmit}>
        <Section>
          <Field name="date">
            <DatePicker>
              <Label>Date</Label>
            </DatePicker>
          </Field>

          <Field name="dateDefaultValue">
            <DatePicker>
              <Label>Date</Label>
            </DatePicker>
          </Field>

          <Field
            name="dateRequired"
            rules={{ required: "Please select a date" }}
          >
            <DatePicker>
              <Label>Date</Label>
            </DatePicker>
          </Field>

          <Field name="dateMinValue">
            <DatePicker minValue={today(getLocalTimeZone())}>
              <Label>Future date</Label>
            </DatePicker>
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
    const form = useForm({
      defaultValues: {
        field: parseDate("2025-09-01"),
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
          <DatePicker>
            <Label>Text</Label>
          </DatePicker>
        </Field>
        <DatePicker isInvalid>
          <Label>Text</Label>
          <FieldError>ErrorFromOuterFieldError!</FieldError>
        </DatePicker>
      </Form>
    );
  },
};

export const WithFocus: Story = {
  render: () => {
    const form = useForm({
      defaultValues: {
        field: parseDate("2025-09-01"),
      },
    });
    return (
      <Form form={form} onSubmit={async () => await sleep(2000)}>
        <Field name={"field"}>
          <DatePicker>
            <Label>Text</Label>
          </DatePicker>
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
