import type { Meta, StoryObj } from "@storybook/react";
import { useForm } from "react-hook-form";
import { action } from "storybook/actions";
import {
  Field,
  ResetButton,
  SubmitButton,
} from "@/integrations/react-hook-form";
import { Form, typedField } from "@/integrations/react-hook-form";
import { Button } from "@/components/Button";
import { Section } from "@/components/Section";
import { ActionGroup } from "@/components/ActionGroup";
import { sleep } from "@/lib/promises/sleep";
import { Autocomplete } from "@/components/Autocomplete";
import { Label } from "@/components/Label";
import { TextField } from "@/components/TextField";
import Option from "@/components/Option";
import React, { useEffect } from "react";
import { FieldError } from "@/components/FieldError";

const submitAction = action("submit");

const generateFromString = (value: string | undefined = "") => {
  return ["example.com", "test.org", "email.net", "mail.com"].map((d) => {
    const email = `${value.split("@")[0]}@${d}`;
    return (
      <Option key={email} value={email} textValue={email}>
        {email}
      </Option>
    );
  });
};

const meta: Meta<typeof Autocomplete> = {
  title: "Integrations/React Hook Form/Autocomplete",
  component: Autocomplete,
  render: () => {
    interface Values {
      email: string;
    }

    const handleOnSubmit = async (values: Values) => {
      await sleep(1500);
      submitAction(values);
    };

    const form = useForm<Values>({
      defaultValues: {
        email: "",
      },
    });

    const Field = typedField(form);
    const email = form.watch("email");

    return (
      <Form form={form} onSubmit={handleOnSubmit}>
        <Section>
          <Field name="email">
            <Autocomplete>
              <TextField>
                <Label>Test</Label>
              </TextField>
              {generateFromString(email)}
            </Autocomplete>
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

    const fieldValue = form.watch("field");

    return (
      <Form form={form} onSubmit={async () => await sleep(2000)}>
        <Field name={"field"}>
          <Autocomplete {...props}>
            <TextField>
              <Label>Test</Label>
            </TextField>
            {generateFromString(fieldValue)}
          </Autocomplete>
        </Field>
        <Autocomplete {...props} isInvalid>
          <TextField>
            <Label>Test</Label>
          </TextField>
          <FieldError>ErrorFromOuterFieldError!</FieldError>
          {generateFromString(fieldValue)}
        </Autocomplete>
      </Form>
    );
  },
};

export const WithFocus: Story = {
  render: (props) => {
    const form = useForm();
    const fieldValue = form.watch("field");

    return (
      <Form form={form} onSubmit={async () => await sleep(2000)}>
        <Field name={"field"}>
          <Autocomplete {...props}>
            <TextField>
              <Label>Test</Label>
            </TextField>
            {generateFromString(fieldValue)}
          </Autocomplete>
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
