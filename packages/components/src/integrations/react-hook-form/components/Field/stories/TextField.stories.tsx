import { ActionGroup } from "@/components/ActionGroup";
import { Button } from "@/components/Button";
import { Label } from "@/components/Label";
import { Section } from "@/components/Section";
import { TextField } from "@/components/TextField";
import { Field, Form, typedField } from "@/integrations/react-hook-form";
import { sleep } from "@/lib/promises/sleep";
import { action } from "@storybook/addon-actions";
import type { Meta, StoryObj } from "@storybook/react";
import { useForm } from "react-hook-form";

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

export const WithTransformedValue: Story = {
  render: () => {
    interface Values {
      name: string;
    }

    const handleOnSubmit = (values: Values) => {
      submitAction(values);
    };

    const form = useForm<Values>({
      defaultValues: {
        name: "",
      },
    });

    const Field = typedField(form);

    return (
      <Form form={form} onSubmit={handleOnSubmit}>
        <Section>
          <Field name="name">
            <TextField
              value={form.watch("name")}
              onChange={(val) => {
                form.setValue("name", val.toUpperCase());
              }}
            >
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
