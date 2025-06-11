"use client";
import {
  Select,
  Option,
  Section,
  CodeBlock,
  FileField,
  Label,
  Form,
  TextField,
  CheckboxGroup,
  Checkbox,
  Button,
} from "@mittwald/flow-remote-react-components";
import { useState } from "react";

export default function Page() {
  const [event, setEvent] = useState<Record<string, unknown>>();

  return (
    <Form
      onSubmit={async (data: FormData) => {
        setEvent({
          data: data.entries().toArray(),
          certificates: await Promise.all(
            Array.from(data.getAll("certificates") as File[]).map(
              async (file: File) => ({
                name: file.name,
                resolvedDataLengthFromArrayBuffer: (await file.arrayBuffer())
                  .byteLength,
              }),
            ),
          ),
        });
      }}
    >
      <Section>
        <CheckboxGroup name="check">
          <Label>Berechtigungen</Label>
          <Checkbox value="read">Lesen</Checkbox>
          <Checkbox value="write">Schreiben</Checkbox>
        </CheckboxGroup>
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
        <FileField multiple name="certificates">
          <Label>Zertifikates</Label>
          <Button variant="outline" color="secondary">
            Auswählen
          </Button>
        </FileField>
        <Button type="submit">Submit</Button>
        <CodeBlock code={JSON.stringify(event, undefined, 2)} />
      </Section>
    </Form>
  );
}
