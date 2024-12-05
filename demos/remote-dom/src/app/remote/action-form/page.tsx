"use client";
import {
  Button,
  Text,
  Form,
  Section,
  TextField,
} from "@mittwald/flow-remote-react-components";
import { formServerAction } from "@/app/remote/actions";
import { useActionState } from "react";

export default function Page() {
  const [callCount, dispatchFormServerAction, isPending] = useActionState(
    formServerAction,
    0,
  );

  return (
    <Form action={dispatchFormServerAction}>
      <Section>
        <TextField name="test" aria-label="Test" />
        <Button type="submit" isPending={isPending}>
          Submit
        </Button>
        <Text>Called {callCount} times</Text>
      </Section>
    </Form>
  );
}
