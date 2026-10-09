<script>
  import { Button, Section } from "@mittwald/flow-remote-svelte-components";
  import Thrower from "./Thrower.svelte";

  let throwOnRender = $state(false);
</script>

<!--
  `RemoteRoot` catches the render error in a `<svelte:boundary>` and reports the
  message to the host, which shows its own failure state — the same contract
  React's error boundary fulfils under `/remote/error`.
-->
<Section>
  {#if throwOnRender}<Thrower />{/if}
  <Button color="danger" onPress={() => (throwOnRender = true)}
    >Engage hyperdrive</Button
  >
</Section>
