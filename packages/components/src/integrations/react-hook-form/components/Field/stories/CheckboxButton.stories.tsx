import type { Meta, StoryObj } from "@storybook/react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { action } from "storybook/actions";
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
import { Text } from "@/components/Text";
import { CheckboxButton } from "@/components/CheckboxButton";
import Content from "@/components/Content";
import { FieldError } from "@/components/FieldError";

const submitAction = action("submit");

const meta: Meta<typeof Field> = {
  title: "Integrations/React Hook Form/CheckboxButton",
  component: Field,
  render: () => {
    interface Values {
      acceptTerms: boolean;
    }

    const handleSubmit = async (values: Values) => {
      await sleep(1500);
      submitAction(values);
    };

    const form = useForm<Values>({
      defaultValues: {
        acceptTerms: false,
      },
    });

    const Field = typedField(form);

    return (
      <Form form={form} onSubmit={handleSubmit}>
        <Section>
          <Field name="acceptTerms">
            <CheckboxButton>
              <Text>Terms and Conditions</Text>
              <Content>Consent to terms and conditions</Content>
            </CheckboxButton>
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
          <CheckboxButton {...props}>
            <Text>Terms and Conditions</Text>
            <Content>Consent to terms and conditions</Content>
          </CheckboxButton>
        </Field>
        <CheckboxButton {...props} isInvalid>
          <Text>Terms and Conditions</Text>
          <Content>Consent to terms and conditions</Content>
          <FieldError>ErrorFromOuterFieldError!</FieldError>
        </CheckboxButton>
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
          <CheckboxButton {...props}>
            <Text>Terms and Conditions</Text>
            <Content>Consent to terms and conditions</Content>
          </CheckboxButton>
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
