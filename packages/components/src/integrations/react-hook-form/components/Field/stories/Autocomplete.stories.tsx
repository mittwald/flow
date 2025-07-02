import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { useForm } from "react-hook-form";
import { action } from "@storybook/addon-actions";
import type { Field } from "@/integrations/react-hook-form";
import { Form, typedField } from "@/integrations/react-hook-form";
import { Button } from "@/components/Button";
import { Section } from "@/components/Section";
import { ActionGroup } from "@/components/ActionGroup";
import { sleep } from "@/lib/promises/sleep";
import { Autocomplete } from "@/components/Autocomplete";
import { MenuItem } from "@/components/MenuItem";
import { Label } from "@/components/Label";
import { ContextMenu } from "@/components/ContextMenu";
import { TextField } from "@/components/TextField";

const submitAction = action("submit");

const generateFromString = (value: string) => {
  return ["example.com", "test.org", "email.net", "mail.com"].map((d) => {
    const email = `${value.split("@")[0]}@${d}`;
    return (
      <MenuItem id={email} textValue={email}>
        {email}
      </MenuItem>
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
              <ContextMenu>{generateFromString(email)}</ContextMenu>
            </Autocomplete>
          </Field>
          <ActionGroup>
            <Button onPress={() => form.reset()}>Reset</Button>
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
