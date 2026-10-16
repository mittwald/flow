<script>
  import {
    Heading,
    LoadingIndicator,
    Section,
    Text,
  } from "@mittwald/flow-remote-svelte-components";

  let isReady = $state(false);

  $effect(() => {
    const interval = setInterval(() => {
      isReady = !isReady;
      console.log("App is ready?", isReady);
    }, 5000);
    return () => clearInterval(interval);
  });
</script>

<Section>
  <Heading>Death Star</Heading>
  <Text>Loading the command console…</Text>
  <LoadingIndicator show={!isReady} />
</Section>
