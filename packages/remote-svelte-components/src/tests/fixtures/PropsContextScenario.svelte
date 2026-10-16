<script lang="ts">
  import Heading from "../../auto-generated/Heading.svelte";
  import Section from "../../auto-generated/Section.svelte";
  import PropsContextProvider from "../../lib/PropsContextProvider.svelte";
</script>

<!--
  The `Heading` inside the provider is configured by it. The one inside the
  `Section` is not: a generated component clears the props context for its own
  children, the way every Flow UI component does.
-->
<PropsContextProvider
  props={{ Heading: { class: "configured-by-the-context", level: 4 } }}
><Heading>Configured</Heading><Section><Heading>Cleared</Heading></Section></PropsContextProvider>
