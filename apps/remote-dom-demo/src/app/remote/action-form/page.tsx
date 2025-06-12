"use client";
import {
  Button,
  Text,
  Form,
  Section,
  TextField,
  FileField,
  Select,
  Option,
  Label,
  CodeBlock,
  CheckboxGroup,
  Checkbox,
} from "@mittwald/flow-remote-react-components";
import { formServerAction } from "@/app/actions";
import { type FC, useActionState } from "react";
import { useFormStatus } from "react-dom";

export interface ActionState {
  increment: number;
}

const FormStatus: FC = () => {
  const status = useFormStatus();
  return <CodeBlock code={JSON.stringify(status, undefined, 2)} />;
};

export default function Page() {
  const [state, dispatchFormServerAction, isPending] = useActionState(
    formServerAction,
    {
      increment: 0,
    },
  );

  return (
    <Form action={dispatchFormServerAction}>
      <Section>
        <CheckboxGroup name={"check"}>
          <Label>Berechtigungen</Label>
          <Checkbox value="read">Lesen</Checkbox>
          <Checkbox value="write">Schreiben</Checkbox>
        </CheckboxGroup>
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
        <TextField name="test" aria-label="Test" />
        <FileField multiple name="certificates">
          <Label>Zertifikate</Label>
          <Button variant="outline" color="secondary">
            Auswählen
          </Button>
        </FileField>
        <Button type="submit" isPending={isPending}>
          Submit
        </Button>
        <Text>Called {state.increment} times</Text>
        <CodeBlock code={JSON.stringify({ isPending }, undefined, 2)} />
      </Section>
      <FormStatus />
    </Form>
  );
}
