<script>
  import {
    Button,
    CodeBlock,
    FileDropZone,
    FileField,
    Form,
    Heading,
    Icon,
    Section,
  } from "@mittwald/flow-remote-svelte-components";
  import { iconUpload } from "./lib/icons.js";
  import TablerIcon from "./lib/TablerIcon.svelte";

  /*
   * The React page wires the fields through react-hook-form; there is no Svelte
   * integration, so this one reads the `FormData` the host collected — the
   * files cross the boundary either way, which is what the demo is about.
   */
  let submitted = $state(undefined);

  const submit = async (data) => {
    submitted = await Promise.all(
      [...data.entries()].map(async ([name, value]) =>
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
</script>

<Form onSubmit={(data) => void submit(data)}>
  <Section>
    <FileDropZone>
      <Icon><TablerIcon paths={iconUpload} /></Icon>
      <Heading>Drop file here</Heading>
      <FileField name="fileDrop"><Button>Choose file</Button></FileField>
    </FileDropZone>
    <FileField name="files" multiple={true}
      ><Button>Choose file</Button></FileField
    >
    <Button type="submit">Submit</Button>
    <CodeBlock code={JSON.stringify(submitted, undefined, 2)} />
  </Section>
</Form>
