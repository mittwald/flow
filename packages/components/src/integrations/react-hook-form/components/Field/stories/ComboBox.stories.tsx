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
import {
  ContextualHelp,
  ContextualHelpTrigger,
} from "@/components/ContextualHelp";
import { Text } from "@/components/Text";
import { dummyText } from "@/lib/dev/dummyText";

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

export const WithFocusAndError: Story = {
  render: () => {
    const form = useForm();

    return (
      <Form form={form} onSubmit={async () => await sleep(2000)}>
        <Field name={"text"} rules={{ required: true }}>
          <ComboBox>
            <Label>
              Domain
              <ContextualHelpTrigger>
                <Button />
                <ContextualHelp>
                  <Text>{dummyText.short}</Text>
                </ContextualHelp>
              </ContextualHelpTrigger>
            </Label>
            <Option>mydomain.de</Option>
            <Option>shop.mydomain.de</Option>
            <Option>anotherdomain.com</Option>
            <Option>www.anotherdomain.com</Option>
            <Option>anotherdomain.com/shop</Option>
            <Option>anotherdomain.com/blog</Option>
            <Option>onemoredomain.de</Option>
            <Option>www.onemoredomain.de</Option>
          </ComboBox>
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
