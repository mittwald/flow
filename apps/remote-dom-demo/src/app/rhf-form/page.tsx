"use client";
import {
  Button,
  Checkbox,
  CheckboxGroup,
  Label,
  Section,
  TextField,
} from "@mittwald/flow-remote-react-components";
import {
  Field,
  Form,
} from "@mittwald/flow-remote-react-components/react-hook-form";
import { useForm } from "react-hook-form";

export default function Page() {
  const form = useForm();

  return (
    <Form onSubmit={console.log} form={form}>
      <Section>
        <Field name="test">
          <TextField aria-label="Test" />
        </Field>
        <Field name="test2">
          <CheckboxGroup>
            <Label>Checkboxes</Label>
            <Checkbox value="foo">
              <Label>Foo</Label>
            </Checkbox>
            <Checkbox value="bar">
              <Label>Bar</Label>
            </Checkbox>
          </CheckboxGroup>
        </Field>
        <Button type="submit">Submit</Button>
      </Section>
    </Form>
  );
}
