<script>
  import {
    Heading,
    Section,
    Text,
  } from "@mittwald/flow-remote-svelte-components";
</script>

<!--
  Stands in for a demo that only exists as a React remote app. Rendered instead
  of nothing so the Svelte app stays mounted while the host navigates:
  unmounting would drop the connection, and the next demo would have to announce
  a second remote root to the same host.
-->
<Section>
  <Heading>Not ported yet</Heading>
  <Text
    >This demo exists as a React remote app only — it needs Flow's List,
    react-hook-form, a Next server action or a Flow icon set, none of which have
    a Svelte counterpart.</Text
  >
</Section>
