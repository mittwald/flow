"use client";

import { TextField, Button } from "@mittwald/flow-remote-react-components";
import { Field } from "@mittwald/flow-react-components/react-hook-form";
import { Form } from "@mittwald/flow-remote-react-components/react-hook-form";
import { useForm } from "react-hook-form";

export default function Page() {
  const form = useForm({
    defaultValues: {
      email: "foo",
      password: "",
    },
  });

  return (
    <Form form={form} onSubmit={(data) => console.log("here", data)}>
      <Field rules={{ required: true }} name={"email"}>
        <TextField type="text" />
      </Field>
      <Field name={"password"} rules={{ required: true }}>
        <TextField type="password" />
      </Field>
      <Button type={"submit"}>Login</Button>
    </Form>
  );
}
