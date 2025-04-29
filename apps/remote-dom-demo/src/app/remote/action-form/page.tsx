"use client";
import {
  Button,
  Text,
  Form,
  Section,
  TextField,
  FileField,
  Label,
  CodeBlock,
} from "@mittwald/flow-remote-react-components";
import { formServerAction } from "@/app/actions";
import type { FC } from "react";
import { useFormStatus } from "react-dom";
import { useActionState } from "react";

const FormStatus: FC = () => {
  const status = useFormStatus();
  return <CodeBlock code={JSON.stringify(status, undefined, 2)} />;
};

export default function Page() {
  const [callCount, dispatchFormServerAction, isPending] = useActionState(
    formServerAction,
    0,
  );

  return (
    <Form action={dispatchFormServerAction}>
      <Section>
        <TextField name="test" aria-label="Test" />
        <FileField name="certificate">
          <Label>Zertifikat</Label>
          <Button variant="outline" color="secondary">
            Auswählen
          </Button>
        </FileField>
        <Button type="submit" isPending={isPending}>
          Submit
        </Button>
        <Text>Called {callCount} times</Text>
        <FormStatus />
      </Section>
    </Form>
  );
}
