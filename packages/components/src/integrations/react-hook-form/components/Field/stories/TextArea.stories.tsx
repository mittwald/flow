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
import { dummyText } from "@/lib/dev/dummyText";
import { TextArea } from "@/components/TextArea";

const submitAction = action("submit");

const meta: Meta<typeof Field> = {
  title: "Integrations/React Hook Form/TextArea",
  component: Field,
  render: () => {
    interface Values {
      message: string;
      messageDefaultValue: string;
      messageRequired: string;
      messageMaxLength: string;
    }

    const handleOnSubmit = async (values: Values) => {
      await sleep(1500);
      submitAction(values);
    };

    const form = useForm<Values>({
      defaultValues: {
        message: "",
        messageDefaultValue: dummyText.medium,
        messageRequired: "",
        messageMaxLength: "",
      },
    });

    const Field = typedField(form);

    return (
      <Form form={form} onSubmit={handleOnSubmit}>
        <Section>
          <Field name="message">
            <TextArea>
              <Label>Message</Label>
            </TextArea>
          </Field>

          <Field name="messageDefaultValue">
            <TextArea>
              <Label>Message</Label>
            </TextArea>
          </Field>

          <Field
            name="messageRequired"
            rules={{ required: "Please enter your message" }}
          >
            <TextArea>
              <Label>Message</Label>
            </TextArea>
          </Field>

          <Field name="messageMaxLength">
            <TextArea maxLength={100} showCharacterCount>
              <Label>Message</Label>
            </TextArea>
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
