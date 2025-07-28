import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { useForm } from "react-hook-form";
import { action } from "storybook/actions";
import { Field, Form, typedField } from "@/integrations/react-hook-form";
import { Button } from "@/components/Button";
import { Section } from "@/components/Section";
import { ActionGroup } from "@/components/ActionGroup";
import { sleep } from "@/lib/promises/sleep";
import { Checkbox } from "@/components/Checkbox";

const submitAction = action("submit");

const meta: Meta<typeof Field> = {
  title: "Integrations/React Hook Form/Checkbox",
  component: Field,
  render: () => {
    interface Values {
      acceptTerms: boolean;
      acceptTermsDefaultValue: boolean;
      acceptTermsRequired: boolean;
    }

    const handleOnSubmit = async (values: Values) => {
      await sleep(1500);
      submitAction(values);
    };

    const form = useForm<Values>({
      defaultValues: {
        acceptTerms: false,
        acceptTermsDefaultValue: true,
        acceptTermsRequired: false,
      },
    });

    const Field = typedField(form);

    return (
      <Form form={form} onSubmit={handleOnSubmit}>
        <Section>
          <Field name="acceptTerms">
            <Checkbox>Accept terms</Checkbox>
          </Field>

          <Field name="acceptTermsDefaultValue">
            <Checkbox>Accept terms</Checkbox>
          </Field>

          <Field name="acceptTermsRequired" rules={{ required: true }}>
            <Checkbox>Accept terms</Checkbox>
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
