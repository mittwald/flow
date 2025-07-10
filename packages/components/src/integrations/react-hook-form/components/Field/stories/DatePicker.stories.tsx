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
import { type CalendarDate, parseDate } from "@internationalized/date";
import { getLocalTimeZone, today } from "@internationalized/date";
import DatePicker from "@/components/DatePicker";

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
