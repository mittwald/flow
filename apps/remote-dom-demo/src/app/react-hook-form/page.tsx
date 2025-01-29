"use client";

import Field from "@mittwald/flow-react-components/react-hook-form/Field";
import { TextField, Button } from "@mittwald/flow-remote-react-components";
import { Form } from "@mittwald/flow-remote-react-components/integrations/react-hook-form";
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
      <Field
        rules={{
          validate: {
            customRule: (val) => {
              console.log("foo");
              return val === "test" ? true : "Waaaa";
            },
          },
        }}
        name={"email"}
      >
        <TextField type="text" />
      </Field>
      <Button type={"submit"}>Login</Button>
    </Form>
  );
}
