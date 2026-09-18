<script>
  import { NotificationProvider } from "@mittwald/flow-remote-svelte-components";
  import Transmissions from "./Transmissions.svelte";
</script>

<!--
  The provider is this package's Svelte rebuild: the notifications live in a
  reactive list in the extension, and the host renders them in its own
  container.
-->
<NotificationProvider><Transmissions /></NotificationProvider>
