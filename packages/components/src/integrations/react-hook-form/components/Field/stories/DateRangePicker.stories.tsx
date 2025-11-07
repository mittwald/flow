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
import { getLocalTimeZone, parseDate, today } from "@internationalized/date";
import type { DateRange } from "react-aria-components";
import { DateRangePicker } from "@/components/DateRangePicker";
import { FieldDescription } from "@/components/FieldDescription";
import { FieldError } from "@/components/FieldError";

const submitAction = action("submit");

const meta: Meta<typeof Field> = {
  title: "Integrations/React Hook Form/DateRangePicker",
  component: Field,
  render: () => {
    interface Values {
      dateRange: DateRange;
      dateRangeDefaultValue: DateRange;
      dateRangeRequired: DateRange;
      dateRangeMinValue: DateRange;
    }

    const handleOnSubmit = async (values: Values) => {
      await sleep(1500);
      submitAction(values);
    };

    const form = useForm<Values>({
      defaultValues: {
        dateRangeDefaultValue: {
          start: parseDate("2025-09-01"),
          end: parseDate("2025-12-24"),
        },
      },
    });

    const Field = typedField(form);

    return (
      <Form form={form} onSubmit={handleOnSubmit}>
        <Section>
          <Field name="dateRange">
            <DateRangePicker>
              <Label>Date range</Label>
            </DateRangePicker>
          </Field>

          <Field name="dateRangeDefaultValue">
            <DateRangePicker>
              <Label>Date range</Label>
            </DateRangePicker>
          </Field>

          <Field
            name="dateRangeRequired"
            rules={{ required: "Please select a date range" }}
          >
            <DateRangePicker>
              <Label>Date range</Label>
            </DateRangePicker>
          </Field>

          <Field name="dateRangeMinValue">
            <DateRangePicker minValue={today(getLocalTimeZone())}>
              <Label>Future date range</Label>
            </DateRangePicker>
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
          <DateRangePicker>
            <Label>Future Date</Label>
            <FieldDescription>Select a future date</FieldDescription>
          </DateRangePicker>
        </Field>
        <DateRangePicker isInvalid>
          <Label>Future Date</Label>
          <FieldDescription>Select a future date</FieldDescription>
          <FieldError>ErrorFromOuterFieldError!</FieldError>
        </DateRangePicker>
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
          <DateRangePicker>
            <Label>Future Date</Label>
            <FieldDescription>Select a future date</FieldDescription>
          </DateRangePicker>
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
