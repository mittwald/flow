"use client";

import {
  Button,
  TextField,
  FileField,
  Label,
} from "@mittwald/flow-remote-react-components";
import {
  Form,
  Field,
} from "@mittwald/flow-remote-react-components/react-hook-form";
import { useForm } from "react-hook-form";

export default function Page() {
  const form = useForm({
    defaultValues: {
      email: "test",
      file: [],
    },
  });

  return (
    <Form form={form} onSubmit={(data) => console.log("here", data)}>
      <Field
        rules={{
          validate: {
            customRule: (val) => {
              return val === "test" ? true : "Waaaa";
            },
          },
        }}
        name={"email"}
      >
        <TextField type="text" />
      </Field>
      <Field name={"file"}>
        <FileField>
          <Label>Zertifikat</Label>
          <Button variant="outline" color="secondary">
            Auswählen
          </Button>
        </FileField>
      </Field>
      <Button type={"submit"}>Login</Button>
      <Button type={"reset"}>Reset</Button>
    </Form>
  );
}
