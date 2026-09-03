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
          <Label>Clearance</Label>
          <Checkbox value="archives">Jedi Archives</Checkbox>
          <Checkbox value="command">Command deck</Checkbox>
        </CheckboxGroup>
        <RadioGroup name="role" defaultValue="admin">
          <Label>Rank</Label>
          <Radio value="admin">Commander</Radio>
          <Radio value="member">Pilot</Radio>
          <Radio value="accountant">Engineer</Radio>
        </RadioGroup>
        <Autocomplete>
          <TextField name="text" aria-label="Homeworld" />
          <Option textValue="Tatooine" value="Tatooine">
            Tatooine
          </Option>
          <Option textValue="Alderaan" value="Alderaan">
            Alderaan
          </Option>
        </Autocomplete>

        <Select name="select" aria-label="Homeworld">
          <Option value="Tatooine" textValue="Tatooine">
            Tatooine
          </Option>
          <Option value="Alderaan" textValue="Alderaan">
            Alderaan
          </Option>
          <Option value="Hoth" textValue="Hoth">
            Hoth
          </Option>
        </Select>
        <FileField multiple name="certificates">
          <Label>Holocrons</Label>
          <Button variant="outline" color="secondary">
            Choose
          </Button>
        </FileField>
        <Button type="submit">Submit</Button>
        <CodeBlock code={JSON.stringify(event, undefined, 2)} />
      </Section>
    </Form>
  );
}
