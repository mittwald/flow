/** @jsxImportSource @/app/remote-vue/_lib */
import {
  Button,
  CodeBlock,
  FileDropZone,
  FileField,
  Form,
  Heading,
  IconUpload,
  Section,
} from "@mittwald/flow-remote-vue-components";
import { defineComponent, ref } from "vue";

/**
 * The Vue counterpart of `/remote/files`.
 *
 * The React page wires the fields through react-hook-form; there is no Vue
 * integration, so this one submits the `FormData` the host collected — the
 * files cross the boundary either way.
 */
export const FilesDemo = defineComponent({
  name: "FilesDemo",
  setup() {
    const submitted = ref<unknown>();

    const onSubmit = async (data: FormData) => {
      submitted.value = await Promise.all(
        Array.from(data.entries()).map(async ([name, value]) =>
          value instanceof File
            ? {
                name,
                file: value.name,
                bytes: (await value.arrayBuffer()).byteLength,
              }
            : { name, value },
        ),
      );
    };

    return () => (
      <Form onSubmit={onSubmit}>
        <Section>
          <FileDropZone>
            <IconUpload />
            <Heading>Drop file here</Heading>
            <FileField name="dropped">
              <Button>Choose file</Button>
            </FileField>
          </FileDropZone>
          <FileField name="files" multiple>
            <Button>Choose file</Button>
          </FileField>
          <Button type="submit">Submit</Button>
          <CodeBlock code={JSON.stringify(submitted.value, undefined, 2)} />
        </Section>
      </Form>
    );
  },
});
