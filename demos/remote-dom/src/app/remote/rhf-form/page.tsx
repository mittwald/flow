"use client";
import {
  Button,
  TextField,
  Form as RemoteForm,
} from "@mittwald/flow-remote-react-components";
import { Field, Form } from "@mittwald/flow-react-components/react-hook-form";
import { useForm } from "react-hook-form";

export default function Page() {
  const form = useForm();

  return (
    <Form onSubmit={console.log} form={form} formComponent={RemoteForm}>
      <Field name="test">
        <TextField aria-label="Test" />
      </Field>
      <Button type="submit">Submit</Button>
    </Form>
  );
}
