"use client";
import {
  Select,
  Option,
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
    text: string;
    select: string;
  }

  return (
    <Form
      onSubmit={(data: FormData) => {
        setEvent(data);
      }}
    >
      <Section>
        <TextField name="text" aria-label="Text" />
        <Select name="select" aria-label="Select">
          <Option value="Foo" textValue="Foo">
            Foo
          </Option>
          <Option value="Bar" textValue="Bar">
            Bar
          </Option>
          <Option value="Baz" textValue="Baz">
            Baz
          </Option>
        </Select>
        <Button type="submit">Submit</Button>
        <CodeBlock code={JSON.stringify(event, undefined, 2)} />
      </Section>
    </Form>
  );
}
