<script>
  import { Button, Section, Text } from "@mittwald/flow-remote-svelte-components";

  let renderUnknown = $state(false);
</script>

<Section>
  <Text
    >Renders a remote element with a tag the host cannot map, triggering the "No
    component found for remote element" error. The host holds the error back
    until it has been delivered to the remote, then re-throws it. The error
    therefore surfaces on both sides.</Text
  >
  {#if renderUnknown}<flr-unknown-component>unknown component</flr-unknown-component>{/if}
  <Button color="danger" onPress={() => (renderUnknown = true)}
    >Render unknown component</Button
  >
</Section>
