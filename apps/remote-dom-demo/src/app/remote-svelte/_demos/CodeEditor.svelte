<script>
  import {
    ActionGroup,
    Button,
    CodeEditor,
    Form,
    Section,
  } from "@mittwald/flow-remote-svelte-components";

  /*
   * The React page wires the editor through react-hook-form; there is no Svelte
   * integration, so the value is held here and the form submits it.
   */
  let code = $state("hyperdrive_class=1.0");
</script>

<Section>
  <Form onSubmit={() => console.log("Submitted:", { code })}>
    <CodeEditor
      language="tsx"
      name="code"
      value={code}
      onChange={(next) => (code = next)}
    />
    <ActionGroup>
      <Button type="submit">Save configuration</Button>
    </ActionGroup>
  </Form>
</Section>
