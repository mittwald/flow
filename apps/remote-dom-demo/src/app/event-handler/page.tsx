"use client";
import {
  Button,
  CodeBlock,
  Section,
  TextField,
} from "@mittwald/flow-remote-react-components";
import { useState } from "react";

export default function Page() {
  const [event, setEvent] = useState<unknown>();

  return (
    <Section>
      <Button onPress={setEvent} color="danger" variant="outline">
        Press me
      </Button>
      <TextField onChange={setEvent} aria-label="Test" />
      <CodeBlock code={JSON.stringify(event, undefined, 2)} />
    </Section>
  );
}
