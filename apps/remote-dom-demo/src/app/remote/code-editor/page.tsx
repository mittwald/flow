"use client";
import {
  ActionGroup,
  CodeEditor,
  Section,
} from "@mittwald/flow-remote-react-components";
import { useForm } from "react-hook-form";
import {
  Field,
  Form,
  SubmitButton,
} from "@mittwald/flow-remote-react-components/react-hook-form";

export default function Page() {
  const form = useForm({
    defaultValues: {
      code: "foo=bar",
    },
  });

  return (
    <Section>
      <Form
        form={form}
        onSubmit={async (data) => {
          console.log("Submitted:", data);
        }}
      >
        <Field name="code">
          <CodeEditor language={"dotEnv"} />
        </Field>
        <ActionGroup>
          <SubmitButton>Send</SubmitButton>
        </ActionGroup>
      </Form>
    </Section>
  );
}
