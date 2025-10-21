import type { Meta, StoryObj } from "@storybook/react";
import React, { useState } from "react";
import { Rating } from "@/components/Rating";
import { Label } from "@/components/Label";
import { FieldError } from "@/components/FieldError";
import { useForm } from "react-hook-form";
import { Form, typedField } from "@/integrations/react-hook-form";
import { Button } from "@/components/Button";

const meta: Meta<typeof Rating> = {
  title: "Form Controls/Rating",
  component: Rating,
  args: { defaultValue: 2 },
  render: (props) => <Rating aria-label="Rating" {...props} />,
};

export default meta;

type Story = StoryObj<typeof Rating>;

export const Default: Story = {};

export const Small: Story = { args: { size: "s" } };

export const ReadOnly: Story = { args: { isReadOnly: true } };

export const WithLabel: Story = {
  render: (props) => (
    <Rating {...props}>
      <Label>Rating</Label>
    </Rating>
  ),
};

export const WithFieldError: Story = {
  render: (props) => (
    <Rating {...props} defaultValue={0} isInvalid isRequired>
      <Label>Rating</Label>
      <FieldError>Please rate</FieldError>
    </Rating>
  ),
};

export const WithControlledValue: Story = {
  render: (props) => {
    const [value, setValue] = useState(4);

    return (
      <Rating {...props} value={value} onChange={(v) => setValue(parseInt(v))}>
        <Label>Rating</Label>
      </Rating>
    );
  },
};

export const WithForm: Story = {
  render: () => {
    const form = useForm<{ rating: number }>({ defaultValues: { rating: 2 } });

    const Field = typedField(form);

    return (
      <Form form={form} onSubmit={async (v) => console.log(v.rating)}>
        <Field name="rating">
          <Rating>
            <Label>Rating</Label>
          </Rating>
        </Field>
        <br />
        <Button type="submit">Submit</Button>
      </Form>
    );
  },
};
