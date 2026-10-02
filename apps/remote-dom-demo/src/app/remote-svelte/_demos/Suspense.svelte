<script>
  import { BrowserOnly } from "@mittwald/flow-remote-svelte-components";
  import Outpost from "./Outpost.svelte";
</script>

<!--
  The React page suspends on a thrown promise; Svelte's `{#await}` in `Outpost`
  waits for one directly. Either way the fallback is a remote tree too, so the
  host renders the loading state — the swap is one more mutation batch.
-->
<BrowserOnly>
  <Outpost label="Tatooine outpost" sleepMs={1500} />
  <Outpost label="Hoth outpost" sleepMs={1100} />
  <Outpost label="Endor outpost" sleepMs={1700} />
</BrowserOnly>
