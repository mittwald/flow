import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { MarkdownEditor } from "@/components/MarkdownEditor";
import { Label } from "@/components/Label";
import { FieldError } from "@/components/FieldError";
import { useForm } from "react-hook-form";
import { Field, Form } from "@/integrations/react-hook-form";
import { Button } from "@/components/Button";
import { action } from "storybook/actions";

const meta: Meta<typeof MarkdownEditor> = {
  title: "Form Controls/MarkdownEditor",
  component: MarkdownEditor,
  args: { placeholder: "Write a message..." },
  render: (props) => <MarkdownEditor {...props} />,
};
export default meta;

type Story = StoryObj<typeof MarkdownEditor>;

export const Default: Story = {};

export const Disabled: Story = { args: { isDisabled: true } };

export const WithLabel: Story = {
  render: (props) => (
    <MarkdownEditor {...props}>
      <Label>Message</Label>
    </MarkdownEditor>
  ),
};

export const ShowCharacterCount: Story = {
  args: { showCharacterCount: true, maxLength: 100 },
};

export const WithFieldError: Story = {
  render: (props) => (
    <MarkdownEditor {...props} isInvalid defaultValue="hello">
      <FieldError>Invalid message</FieldError>
    </MarkdownEditor>
  ),
};

export const Resizeable: Story = {
  args: { rows: 1, autoResizeMaxRows: 5 },
};

export const WithForm: Story = {
  render: (props) => {
    const form = useForm({
      defaultValues: { message: "" },
    });
    return (
      <Form
        form={form}
        onSubmit={async (v) => {
          action(v.message);
          form.reset();
        }}
      >
        <Field name="message" rules={{ required: "Please enter a message" }}>
          <MarkdownEditor {...props}>
            <Label>Message</Label>
          </MarkdownEditor>
        </Field>
        <br />
        <Button type="submit">Submit</Button>
      </Form>
    );
  },
};
