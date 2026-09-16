<script>
  import {
    Button,
    CodeBlock,
    Label,
    Section,
    TextField,
  } from "@mittwald/flow-remote-svelte-components";

  /*
   * The listeners are the interesting half: the host dispatches the event, the
   * payload travels back through the connection, and plain Svelte state drives
   * the next render.
   */
  let events = $state([]);

  const record = (event, payload) => {
    events = [...events.slice(-9), { event, payload }];
  };
</script>

<Section>
  <TextField onChange={(value) => record("change", value)}>
    <Label>Call sign</Label>
  </TextField>
  <Button
    onPress={() => record("press", null)}
    onHoverStart={() => record("hoverStart", null)}
    onFocus={() => record("focus", null)}>Fire</Button
  >
  <CodeBlock code={JSON.stringify(events, undefined, 2)} />
</Section>
