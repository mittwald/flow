<script>
  import {
    Heading,
    Section,
    Text,
  } from "@mittwald/flow-remote-svelte-components";
</script>

<!--
  Stands in for the three demos that only exist as a React remote app: `list`
  and `list-selection` need Flow's `List`, which has no Svelte rebuild, and
  `react-hook-form` is a React integration with no Svelte counterpart.

  Rendered instead of nothing so the Svelte app stays mounted while the host
  navigates: unmounting would drop the connection, and the next demo would have
  to announce a second remote root to the same host.
-->
<Section>
  <Heading>Not ported yet</Heading>
  <Text
    >This demo exists as a React remote app only. `list` and `list-selection`
    need Flow's `List` — 5,500 lines of data sources, filters, sorting and
    persisted view settings, which this package does not rebuild — and
    `react-hook-form` is a React integration.</Text
  >
</Section>
