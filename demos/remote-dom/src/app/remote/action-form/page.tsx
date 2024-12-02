"use client";
import {
  Section,
  CodeBlock,
  Form,
  TextField,
  Button,
} from "@mittwald/flow-remote-react-components";
import { useState } from "react";

export default function Page() {
  const [event, setEvent] = useState<unknown>();

  interface FormData {
    test: string;
  }

  return (
    <Form
      onSubmit={(data: FormData) => {
        setEvent(data);
      }}
    >
      <Section>
        <TextField name="test" aria-label="Test" />
        <Button type="submit">Submit</Button>
        <CodeBlock code={JSON.stringify(event, undefined, 2)} />
      </Section>
    </Form>
  );
}
