"use client";

import { TextField, Button } from "@mittwald/flow-remote-react-components";
import { Field } from "../../../../../packages/components/dist/js/types/integrations/react-hook-form/components/Field";
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
