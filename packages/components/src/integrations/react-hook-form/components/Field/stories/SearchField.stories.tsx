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
import { SearchField } from "@/components/SearchField";

const submitAction = action("submit");

const meta: Meta<typeof Field> = {
  title: "Integrations/React Hook Form/SearchField",
  component: Field,
  render: () => {
    interface Values {
      user: string;
    }

    const handleOnSubmit = async (values: Values) => {
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
      <Form form={form} onSubmit={handleOnSubmit}>
        <Section>
          <Field name="user">
            <SearchField>
              <Label>Suche</Label>
            </SearchField>
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

export const WithFocusAndError: Story = {
  render: () => {
    const form = useForm();

    return (
      <Form form={form} onSubmit={async () => await sleep(2000)}>
        <Field name={"text"} rules={{ required: true }}>
          <SearchField>
            <Label>Role</Label>
          </SearchField>
        </Field>
        <div style={{ marginBottom: "2200px" }} />
        <Button
          onPress={() =>
            form.setError(
              "text",
              { type: "required", message: "oh no" },
              { shouldFocus: true },
            )
          }
        >
          err through form
        </Button>
        <Button onPress={() => form.setFocus("text")}>
          focus through form
        </Button>
        <Button type="submit">Submit</Button>
      </Form>
    );
  },
};
