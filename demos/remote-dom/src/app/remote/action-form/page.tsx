"use client";
import {
  Button,
  Form,
  Section,
  TextField,
} from "@mittwald/flow-remote-react-components";
import { formServerAction } from "@/app/remote/actions";

export default function Page() {
  return (
    <Form action={formServerAction}>
      <Section>
        <TextField name="test" aria-label="Test" />
        <Button type="submit">Submit</Button>
      </Section>
    </Form>
  );
}
