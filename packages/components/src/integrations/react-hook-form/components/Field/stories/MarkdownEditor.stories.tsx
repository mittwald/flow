import type { Meta, StoryObj } from "@storybook/react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { action } from "storybook/actions";
import { Label } from "@/components/Label";
import { Field, Form, typedField } from "@/integrations/react-hook-form";
import { Button } from "@/components/Button";
import { Section } from "@/components/Section";
import { ActionGroup } from "@/components/ActionGroup";
import { sleep } from "@/lib/promises/sleep";
import { MarkdownEditor } from "@/components/MarkdownEditor";
import { FieldError } from "@/components/FieldError";
import { SubmitButton } from "@/integrations/react-hook-form/components/SubmitButton/SubmitButton";
import { ResetButton } from "@/integrations/react-hook-form/components/ResetButton/ResetButton";

const submitAction = action("submit");

const meta: Meta<typeof Field> = {
  title: "Integrations/React Hook Form/MarkdownEditor",
  component: Field,
  render: () => {
    interface Values {
      user: string;
    }

    const handleSubmit = async (values: Values) => {
      await sleep(5000);
      submitAction(values);
    };

    const form = useForm<Values>({
      defaultValues: {
        user: "",
      },
    });

    const Field = typedField(form);

    return (
      <Form form={form} onSubmit={handleSubmit}>
        <Section>
          <Field name="user">
            <MarkdownEditor>
              <Label>Message</Label>
            </MarkdownEditor>
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
        <Section>
          <Field name="field">
            <MarkdownEditor>
              <Label>Message</Label>
            </MarkdownEditor>
          </Field>
          <MarkdownEditor isInvalid>
            <Label>Message</Label>
            <FieldError>ErrorFromOuterFieldError!</FieldError>
          </MarkdownEditor>
        </Section>
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
        <Field name="field">
          <MarkdownEditor>
            <Label>Message</Label>
          </MarkdownEditor>
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
