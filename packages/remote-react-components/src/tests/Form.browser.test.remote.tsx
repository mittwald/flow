import {
  FileField,
  Section,
  Checkbox,
  CheckboxGroup,
  TextField,
  Option,
  Select,
  Button,
  CodeBlock,
} from "@/auto-generated";
import { Form } from "@/components/Form";
import { useState } from "react";

const TestForm: typeof Form = (props) => {
  const { children, ...restProps } = props;

  return (
    <Form {...restProps} data-testid="rendered-form">
      <Section>
        <CheckboxGroup name="check">
          <Checkbox data-testid="form-checkbox-group-option1" value="read">
            read
          </Checkbox>
          <Checkbox data-testid="form-checkbox-group-option2" value="write">
            write
          </Checkbox>
        </CheckboxGroup>
        <TextField
          data-testid="form-textfield"
          placeholder="testInput"
          name="text"
          aria-label="Text"
        />
        <Select data-testid="form-select" name="select" aria-label="Select">
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
        <FileField data-testid="form-filefield" multiple name="certificates" />
        <Button data-testid="form-submit" type="submit">
          Submit
        </Button>
        {children}
      </Section>
    </Form>
  );
};

export const standard = () => <TestForm onSubmit={() => undefined} />;

export const onSubmit = () => {
  const [event, setEvent] = useState<unknown>();

  return (
    <TestForm
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
      <>
        {event && (
          <CodeBlock
            data-testid="form-result"
            code={JSON.stringify(event, undefined, 2)}
          />
        )}
      </>
    </TestForm>
  );
};

export const action = () => <TestForm action={() => undefined} />;

export const onAction = () => {
  const [event, setEvent] = useState<unknown>();

  return (
    <TestForm
      action={async (data: FormData) => {
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
      <>
        {event && (
          <CodeBlock
            data-testid="form-result"
            code={JSON.stringify(event, undefined, 2)}
          />
        )}
      </>
    </TestForm>
  );
};
