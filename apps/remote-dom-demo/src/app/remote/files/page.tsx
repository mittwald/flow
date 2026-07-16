"use client";

import {
  Button,
  FileDropZone,
  Section,
  FileField,
  IconUpload,
  Heading,
} from "@mittwald/flow-remote-react-components";

import {
  Form,
  Field,
} from "@mittwald/flow-remote-react-components/react-hook-form";
import { useForm } from "react-hook-form";

export default function Page() {
  const form = useForm({
    defaultValues: {
      fileDrop: [],
      files: [],
    },
  });

  return (
    <Form form={form} onSubmit={(data) => console.log("Submitted", data)}>
      <Section>
        <Field name="fileDrop">
          <FileDropZone>
            <IconUpload />
            <Heading>Drop file here</Heading>
            <FileField>
              <Button>Choose file</Button>
            </FileField>
          </FileDropZone>
        </Field>
        <Field name="files">
          <FileField>
            <Button>Choose file</Button>
          </FileField>
        </Field>
        <Button type={"submit"}>Submit</Button>
        <Button onPress={() => form.reset()}>Reset</Button>
      </Section>
    </Form>
  );
}
