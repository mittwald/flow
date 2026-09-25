<script>
  import {
    Button,
    CodeBlock,
    Section,
    TextField,
  } from "@mittwald/flow-remote-svelte-components";

  /*
   * The listeners are the interesting half: the host dispatches the event, the
   * payload travels back through the connection, and plain Svelte state drives
   * the next render.
   */
  let event = $state(undefined);
</script>

<Section>
  <Button onPress={(value) => (event = value)} color="danger" variant="outline"
    >Fire proton torpedo</Button
  >
  <TextField onChange={(value) => (event = value)} aria-label="Mission name" />
  <CodeBlock code={JSON.stringify(event, undefined, 2)} />
</Section>
