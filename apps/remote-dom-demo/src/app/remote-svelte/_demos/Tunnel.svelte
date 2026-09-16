<script>
  import {
    Button,
    Content,
    Heading,
    Icon,
    Text,
    TunnelEntry,
  } from "@mittwald/flow-remote-svelte-components";
  import { iconSearch } from "./lib/icons.js";
  import TablerIcon from "./lib/TablerIcon.svelte";
</script>

<!--
  The tunnel is entirely host-side: the extension marks a subtree with an id and
  the host renders it wherever that id exits — here, in the demo's own
  navigation.
-->
<Heading>Fleet search</Heading>
<TunnelEntry id="remote-demo">
  <Button><Icon><TablerIcon paths={iconSearch} /></Icon></Button>
</TunnelEntry>
<Content>
  <Text>Find the search button in the menu to search the fleet</Text>
</Content>
