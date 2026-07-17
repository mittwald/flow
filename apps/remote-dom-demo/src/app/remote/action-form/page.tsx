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
          <Label>Clearance</Label>
          <Checkbox value="archives">Jedi Archives</Checkbox>
          <Checkbox value="command">Command deck</Checkbox>
        </CheckboxGroup>
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
        <TextField name="test" aria-label="Mission name" />
        <FileField multiple name="certificates">
          <Label>Holocrons</Label>
          <Button variant="outline" color="secondary">
            Choose
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
