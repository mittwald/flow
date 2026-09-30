"use client";
import {
  Button,
  CodeBlock,
  CopyButton,
  Section,
  TextField,
} from "@mittwald/flow-remote-react-components";
import { useState } from "react";

export default function Page() {
  const [event, setEvent] = useState<unknown>();

  return (
    <Section>
      <Button onPress={setEvent} color="danger" variant="outline">
        Fire proton torpedo
      </Button>
      <TextField onChange={setEvent} aria-label="Mission name" />
      <CopyButton text="ssh://rebelbase.org" onCopy={setEvent} />
      <CodeBlock code={JSON.stringify(event, undefined, 2)} />
    </Section>
  );
}
