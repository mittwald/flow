import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { useForm } from "react-hook-form";
import { action } from "@storybook/addon-actions";
import { TextField } from "@/components/TextField";
import { Label } from "@/components/Label";
import { Field, Form, typedField } from "@/integrations/react-hook-form";
import { Button } from "@/components/Button";
import { Section } from "@/components/Section";
import { ActionGroup } from "@/components/ActionGroup";
import { sleep } from "@/lib/promises/sleep";

const submitAction = action("submit");

const meta: Meta<typeof Field> = {
  title: "Integrations/React Hook Form/TextField",
  component: Field,
  render: () => {
    interface Values {
      name: string;
      nameDefaultValue: string;
      nameRequired: string;
      nameMaxLength: string;
    }

    const handleOnSubmit = async (values: Values) => {
      await sleep(1500);
      submitAction(values);
    };

    const form = useForm<Values>({
      defaultValues: {
        name: "",
        nameDefaultValue: "John",
        nameRequired: "",
        nameMaxLength: "",
      },
    });

    const Field = typedField(form);

    return (
      <Form form={form} onSubmit={handleOnSubmit}>
        <Section>
          <Field name="name">
            <TextField>
              <Label>Name</Label>
            </TextField>
          </Field>

          <Field name="nameDefaultValue">
            <TextField>
              <Label>Name</Label>
            </TextField>
          </Field>

          <Field
            name="nameRequired"
            rules={{ required: "Please enter your name" }}
          >
            <TextField>
              <Label>Name</Label>
            </TextField>
          </Field>

          <Field name="nameMaxLength">
            <TextField maxLength={10} showCharacterCount>
              <Label>Name</Label>
            </TextField>
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
