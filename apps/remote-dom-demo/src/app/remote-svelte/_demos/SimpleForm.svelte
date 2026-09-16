<script>
  import {
    Button,
    Form,
    Heading,
    Label,
    Section,
    Text,
    TextField,
  } from "@mittwald/flow-remote-svelte-components";

  let pilot = $state("");
  let submitted = $state("");
</script>

<Section>
  <Heading>Enlist a pilot</Heading>
  <Form
    onSubmit={(event) => {
      event.preventDefault?.();
      submitted = pilot;
    }}
  >
    <TextField value={pilot} onChange={(next) => (pilot = next)}>
      <Label>Call sign</Label>
    </TextField>
    <Button type="submit">Enlist</Button>
  </Form>
  {#if submitted}
    <Text>{submitted} reported for duty.</Text>
  {/if}
</Section>
