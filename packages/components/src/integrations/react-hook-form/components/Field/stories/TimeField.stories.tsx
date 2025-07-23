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
import { Time } from "@internationalized/date";
import { TimeField } from "@/components/TimeField";

const submitAction = action("submit");

const meta: Meta<typeof Field> = {
  title: "Integrations/React Hook Form/TimeField",
  component: Field,
  render: () => {
    interface Values {
      time: Time;
      timeDefaultValue: Time;
      timeRequired: Time;
    }

    const handleOnSubmit = async (values: Values) => {
      await sleep(1500);
      submitAction(values);
    };

    const form = useForm<Values>({
      defaultValues: {
        timeDefaultValue: new Time(16, 0),
      },
    });

    const Field = typedField(form);

    return (
      <Form form={form} onSubmit={handleOnSubmit}>
        <Section>
          <Field name="time">
            <TimeField>
              <Label>Time</Label>
            </TimeField>
          </Field>

          <Field name="timeDefaultValue">
            <TimeField>
              <Label>Time</Label>
            </TimeField>
          </Field>

          <Field
            name="timeRequired"
            rules={{ required: "Please enter a time" }}
          >
            <TimeField>
              <Label>Time</Label>
            </TimeField>
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
