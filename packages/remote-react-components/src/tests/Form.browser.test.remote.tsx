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
import { type FC, useState } from "react";

const TestForm: FC<{
  onSubmit?: (data: FormData) => Promise<Record<string, unknown>> | null;
  action?: (data: FormData) => Promise<Record<string, unknown>> | null;
}> = (props) => {
  const { action, onSubmit } = props;
  const [event, setEvent] = useState<Record<string, unknown> | null>(null);

  return (
    <Form
      action={
        action
          ? async (d) => {
              setEvent(await action(d));
            }
          : undefined
      }
      onSubmit={
        onSubmit
          ? async (d) => {
              setEvent(await onSubmit(d));
            }
          : undefined
      }
      data-testid="rendered-form"
    >
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
        {event && (
          <CodeBlock
            data-testid="form-result"
            code={JSON.stringify(event, undefined, 2)}
          />
        )}
      </Section>
    </Form>
  );
};

export const standard = () => {
  return <TestForm onSubmit={() => Promise.resolve({})} />;
};

export const onSubmit = () => {
  return (
    <TestForm
      onSubmit={async (data: FormData) => {
        return {
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
        };
      }}
    />
  );
};

export const action = () => <TestForm action={() => Promise.resolve({})} />;

export const onAction = () => {
  return (
    <TestForm
      action={async (data: FormData) => {
        return {
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
        };
      }}
    />
  );
};
