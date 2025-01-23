"use client";
import Button from "@mittwald/flow-react-components/Button";
import Section from "@mittwald/flow-react-components/Section";
import TextField from "@mittwald/flow-react-components/TextField";
import { useActionState } from "react";
import { formServerAction } from "~/app/remote/actions";

export default function Page() {
  const [, formAction] = useActionState(formServerAction, 0);

  return (
    <form action={formAction}>
      <Section>
        <TextField name="test" aria-label="Test" />
        <Button type="submit">Submit</Button>
      </Section>
    </form>
  );
}
