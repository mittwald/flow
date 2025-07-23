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
import { Option } from "@/components/Option";
import { ComboBox } from "@/components/ComboBox";

const submitAction = action("submit");

const meta: Meta<typeof Field> = {
  title: "Integrations/React Hook Form/ComboBox",
  component: Field,
  render: () => {
    interface Values {
      domain: string;
      domainDefaultValue: string;
      domainRequired: string;
    }

    const handleOnSubmit = async (values: Values) => {
      await sleep(1500);
      submitAction(values);
    };

    const form = useForm<Values>({
      defaultValues: {
        domain: "",
        domainDefaultValue: "mydomain.de",
        domainRequired: "",
      },
    });

    const Field = typedField(form);

    return (
      <Form form={form} onSubmit={handleOnSubmit}>
        <Section>
          <Field name="domain">
            <ComboBox>
              <Label>Domain</Label>
              <Option value="mydomain.de">mydomain.de</Option>
              <Option value="anotherdomain.com">anotherdomain.com</Option>
            </ComboBox>
          </Field>

          <Field name="domainDefaultValue">
            <ComboBox>
              <Label>Domain</Label>
              <Option value="mydomain.de">mydomain.de</Option>
              <Option value="anotherdomain.com">anotherdomain.com</Option>
            </ComboBox>
          </Field>

          <Field
            name="domainRequired"
            rules={{ required: "Please select a domain" }}
          >
            <ComboBox>
              <Label>Domain</Label>
              <Option value="mydomain.de">mydomain.de</Option>
              <Option value="anotherdomain.com">anotherdomain.com</Option>
            </ComboBox>
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
