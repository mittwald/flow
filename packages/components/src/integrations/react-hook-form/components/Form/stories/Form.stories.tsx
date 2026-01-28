import { ActionGroup } from "@/components/ActionGroup";
import { Label } from "@/components/Label";
import { Section } from "@/components/Section";
import { TextField } from "@/components/TextField";
import { typedField } from "@/integrations/react-hook-form/components/Field";
import { Form } from "@/integrations/react-hook-form/components/Form/Form";
import { action } from "storybook/actions";
import type { Meta, StoryObj } from "@storybook/react";
import { useForm } from "react-hook-form";
import {
  asyncLongFunction,
  asyncLongFunctionWithError,
  syncFunctionWithError,
} from "@/components/Button/stories/lib";
import SubmitButton from "@/integrations/react-hook-form/components/SubmitButton";
import ResetButton from "@/integrations/react-hook-form/components/ResetButton";

const submitAction = action("submit");

interface Values {
  name: string;
}

const handleSubmit = async (values: Values) => {
  await asyncLongFunction();
  submitAction(values);
};

const meta: Meta<typeof Form> = {
  title: "Integrations/React Hook Form/Form",
  component: Form,
  render: (props) => {
    const form = useForm<Values>({
      defaultValues: {
        name: "",
      },
    });
    const Field = typedField(form);

    return (
      <Form {...props} form={form} onSubmit={handleSubmit}>
        <Section>
          <Field name="name">
            <TextField>
              <Label>Name</Label>
            </TextField>
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

type Story = StoryObj<typeof Form>;

export const Default: Story = {};

export const ReadOnly: Story = { args: { isReadOnly: true } };

export const WithHandledSubmitError: Story = {
  render: (props) => {
    const form = useForm<Values>({
      defaultValues: {
        name: "",
      },
    });
    const Field = typedField(form);

    return (
      <Form
        {...props}
        form={form}
        onSubmit={() => {
          form.setError("root", {
            message: "An error occurred during form submission.",
          });
        }}
      >
        <Section>
          <Field name="name">
            <TextField>
              <Label>Name</Label>
            </TextField>
          </Field>
          <ActionGroup>
            <SubmitButton>Submit</SubmitButton>
          </ActionGroup>
        </Section>
      </Form>
    );
  },
};

export const WithUnhandledSubmitError: Story = {
  render: (props) => {
    const form = useForm<Values>({
      defaultValues: {
        name: "",
      },
    });
    const Field = typedField(form);

    return (
      <Form {...props} form={form} onSubmit={asyncLongFunctionWithError}>
        <Section>
          <Field name="name">
            <TextField>
              <Label>Name</Label>
            </TextField>
          </Field>
          <ActionGroup>
            <SubmitButton>Submit</SubmitButton>
          </ActionGroup>
        </Section>
      </Form>
    );
  },
};

export const WithUnhandledSubmitErrorSync: Story = {
  render: (props) => {
    const form = useForm<Values>({
      defaultValues: {
        name: "",
      },
    });
    const Field = typedField(form);

    return (
      <Form {...props} form={form} onSubmit={syncFunctionWithError}>
        <Section>
          <Field name="name">
            <TextField>
              <Label>Name</Label>
            </TextField>
          </Field>
          <ActionGroup>
            <SubmitButton>Submit</SubmitButton>
          </ActionGroup>
        </Section>
      </Form>
    );
  },
};

export const WithValidationError: Story = {
  render: (props) => {
    const form = useForm<Values>({
      defaultValues: {
        name: "",
      },
    });
    const Field = typedField(form);

    return (
      <Form {...props} form={form} onSubmit={handleSubmit}>
        <Section>
          <Field
            name="name"
            rules={{
              validate: async () => {
                await asyncLongFunction();
                return "Name is invalid.";
              },
            }}
          >
            <TextField>
              <Label>Name</Label>
            </TextField>
          </Field>
          <ActionGroup>
            <SubmitButton>Submit</SubmitButton>
          </ActionGroup>
        </Section>
      </Form>
    );
  },
};
