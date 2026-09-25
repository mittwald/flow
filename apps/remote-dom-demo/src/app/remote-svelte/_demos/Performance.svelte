<script>
  import {
    Alert,
    Button,
    Heading,
    Section,
    Text,
    TextField,
  } from "@mittwald/flow-remote-svelte-components";

  /*
   * A few hundred elements in one mutation batch, re-rendered twice a second.
   * The interesting number is how long the host needs to apply them, not how
   * long Svelte needs to create them.
   */
  let elemCount = $state(100);
  let showElems = $state(true);
  let ticker = $state(0);

  $effect(() => {
    const interval = setInterval(() => ticker++, 500);
    return () => clearInterval(interval);
  });

  const alerts = $derived(
    Number.isNaN(elemCount) || !showElems ? 0 : elemCount,
  );
</script>

<Section>
  <TextField
    aria-label="Number of fleet alerts"
    onChange={(value) => (elemCount = Number.parseInt(value))}
  />
  <Button onPress={() => (showElems = !showElems)}>Toggle fleet alerts</Button>
  {#each { length: alerts }, index (index)}<Alert
      ><Heading>Fleet alert</Heading><Text>Battle report {ticker}</Text></Alert
    >{/each}
</Section>
