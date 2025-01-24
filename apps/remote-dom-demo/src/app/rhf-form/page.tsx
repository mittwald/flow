"use client";
import { Button, TextField } from "@mittwald/flow-remote-react-components";
import { Field } from "../../../../../packages/components/dist/js/types/integrations/react-hook-form/components/Field";
import { Form } from "@mittwald/flow-remote-react-components/integrations/react-hook-form";
import { useForm } from "react-hook-form";

export default function Page() {
  const form = useForm();

  return (
    <Form onSubmit={console.log} form={form}>
      <Field name="test">
        <TextField aria-label="Test" />
      </Field>
      <Button type="submit">Submit</Button>
    </Form>
  );
}
