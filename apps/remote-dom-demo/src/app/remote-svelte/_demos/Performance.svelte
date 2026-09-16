<script>
  import {
    Button,
    Flex,
    Heading,
    Label,
    Section,
    Text,
  } from "@mittwald/flow-remote-svelte-components";

  /*
   * One mutation batch with a few hundred elements in it — what a list of
   * resources looks like on the wire. The interesting number is how long the
   * host needs to materialize them, not how long Svelte needs to create them.
   */
  let count = $state(0);
  let renderedAt = $state(undefined);

  const render = (next) => {
    renderedAt = performance.now();
    count = next;
  };

  $effect(() => {
    if (count > 0 && renderedAt !== undefined) {
      console.log(
        `Rendered ${count} elements in ${Math.round(performance.now() - renderedAt)} ms`,
      );
    }
  });
</script>

<Section>
  <Heading>Fleet inventory</Heading>
  <Flex columnGap="s">
    <Button onPress={() => render(100)}>100 ships</Button>
    <Button onPress={() => render(500)}>500 ships</Button>
    <Button onPress={() => render(0)}>Clear</Button>
  </Flex>
  <Label>{count} ships</Label>
  {#each { length: count } as _, index (index)}<Text>Ship {index + 1}</Text>{/each}
</Section>
