<script>
  import {
    Button,
    Content,
    Heading,
    IconSearch,
    Text,
    TunnelEntry,
  } from "@mittwald/flow-remote-svelte-components";
</script>

<!--
  The tunnel is entirely host-side: the extension marks a subtree with an id and
  the host renders it wherever that id exits — here, in the demo's own
  navigation.
-->
<Heading>Fleet search</Heading>
<TunnelEntry id="remote-demo">
  <Button><IconSearch /></Button>
</TunnelEntry>
<Content>
  <Text>Find the search button in the menu to search the fleet</Text>
</Content>
