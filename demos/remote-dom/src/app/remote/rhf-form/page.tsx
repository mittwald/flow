"use client";
import { Button, TextField } from "@mittwald/flow-remote-react-components";
import { Field } from "@mittwald/flow-react-components/react-hook-form";
import { Form } from "@mittwald/flow-remote-react-components/react-hook-form";
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
