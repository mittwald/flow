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
import { defineComponent, h, ref } from "vue";

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

    return () =>
      h(
        Form,
        {
          onSubmit: async (data: FormData) => {
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
          },
        },
        () =>
          h(Section, null, () => [
            h(FileDropZone, null, () => [
              h(IconUpload),
              h(Heading, null, () => "Drop file here"),
              h(FileField, { name: "dropped" }, () =>
                h(Button, null, () => "Choose file"),
              ),
            ]),
            h(FileField, { name: "files", multiple: true }, () =>
              h(Button, null, () => "Choose file"),
            ),
            h(Button, { type: "submit" }, () => "Submit"),
            h(CodeBlock, {
              code: JSON.stringify(submitted.value, undefined, 2),
            }),
          ]),
      );
  },
});
