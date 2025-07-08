"use client";
import {
  Select,
  Option,
  Section,
  CodeBlock,
  FileField,
  Label,
  Form,
  RadioGroup,
  Radio,
  TextField,
  CheckboxGroup,
  Checkbox,
  Button,
  ContextMenu,
  MenuItem,
  Autocomplete,
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
        <RadioGroup name="role" defaultValue="admin">
          <Label>Rolle</Label>
          <Radio value="admin">Administrator</Radio>
          <Radio value="member">Mitglied</Radio>
          <Radio value="accountant">Buchhalter</Radio>
        </RadioGroup>
        <Autocomplete>
          <TextField name="text" aria-label="Text" />
          <ContextMenu>
            <MenuItem>Foo</MenuItem>
            <MenuItem>Bar</MenuItem>
          </ContextMenu>
        </Autocomplete>

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
