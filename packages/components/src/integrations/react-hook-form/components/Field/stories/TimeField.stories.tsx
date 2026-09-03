import type { Meta, StoryObj } from "@storybook/react";
import { useEffect } from "react";
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
import { Time } from "@internationalized/date";
import { TimeField } from "@/components/TimeField";
import { FieldError } from "@/components/FieldError";

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

    const handleSubmit = async (values: Values) => {
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
      <Form form={form} onSubmit={handleSubmit}>
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
            <ResetButton slot="abort">Reset</ResetButton>
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
        <Section>
          <Field name="field">
            <TimeField>
              <Label>Time</Label>
            </TimeField>
          </Field>
          <TimeField isInvalid>
            <Label>Time</Label>
            <FieldError>ErrorFromOuterFieldError!</FieldError>
          </TimeField>
        </Section>
      </Form>
    );
  },
};

export const WithFocus: Story = {
  render: () => {
    const form = useForm();
    return (
      <Form form={form} onSubmit={async () => await sleep(2000)}>
        <Field name="text">
          <TimeField>
            <Label>Time</Label>
          </TimeField>
        </Field>
        <div style={{ marginBottom: "2200px" }} />
        <ActionGroup>
          <Button
            variant="soft"
            color="secondary"
            slot="secondary"
            onPress={() =>
              form.setError(
                "field",
                { type: "required", message: "oh no" },
                { shouldFocus: true },
              )
            }
          >
            Error through form
          </Button>
          <Button
            variant="soft"
            color="secondary"
            slot="secondary"
            onPress={() => form.setFocus("field")}
          >
            Focus through form
          </Button>
          <ResetButton slot="abort">Reset</ResetButton>
          <SubmitButton>Submit</SubmitButton>
        </ActionGroup>
      </Form>
    );
  },
};
