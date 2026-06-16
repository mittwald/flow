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
import { Radio, RadioGroup } from "@/components/RadioGroup";
import { FieldError } from "@/components/FieldError";

const submitAction = action("submit");

const meta: Meta<typeof Field> = {
  title: "Integrations/React Hook Form/RadioGroup",
  component: Field,
  render: () => {
    interface Values {
      gender: string;
      genderDefaultValue: string;
      genderRequired: string;
    }

    const handleSubmit = async (values: Values) => {
      await sleep(1500);
      submitAction(values);
    };

    const form = useForm<Values>({
      defaultValues: {
        gender: "",
        genderDefaultValue: "diverse",
        genderRequired: "",
      },
    });

    const Field = typedField(form);

    return (
      <Form form={form} onSubmit={handleSubmit}>
        <Section>
          <Field name="gender">
            <RadioGroup>
              <Label>Gender</Label>
              <Radio value="male">Male</Radio>
              <Radio value="female">Female</Radio>
              <Radio value="diverse">Diverse</Radio>
            </RadioGroup>
          </Field>

          <Field name="genderDefaultValue">
            <RadioGroup>
              <Label>Gender</Label>
              <Radio value="male">Male</Radio>
              <Radio value="female">Female</Radio>
              <Radio value="diverse">Diverse</Radio>
            </RadioGroup>
          </Field>

          <Field
            name="genderRequired"
            rules={{ required: "Please select your gender" }}
          >
            <RadioGroup>
              <Label>Gender</Label>
              <Radio value="male">Male</Radio>
              <Radio value="female">Female</Radio>
              <Radio value="diverse">Diverse</Radio>
            </RadioGroup>
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
            <RadioGroup>
              <Label>Gender</Label>
              <Radio value="male">Male</Radio>
              <Radio value="female">Female</Radio>
              <Radio value="diverse">Diverse</Radio>
            </RadioGroup>
          </Field>
          <RadioGroup isInvalid>
            <Label>Gender</Label>
            <Radio value="male">Male</Radio>
            <Radio value="female">Female</Radio>
            <Radio value="diverse">Diverse</Radio>
            <FieldError>ErrorFromOuterFieldError!</FieldError>
          </RadioGroup>
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
        <Field name="field">
          <RadioGroup>
            <Label>Gender</Label>
            <Radio value="male">Male</Radio>
            <Radio value="female">Female</Radio>
            <Radio value="diverse">Diverse</Radio>
          </RadioGroup>
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
