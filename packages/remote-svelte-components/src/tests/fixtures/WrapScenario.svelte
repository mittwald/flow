<script lang="ts">
  import AccentBox from "../../auto-generated/AccentBox.svelte";
  import Text from "../../auto-generated/Text.svelte";
  import Wrap from "../../components/Wrap.svelte";

  const { wrapped }: { wrapped: boolean } = $props();
</script>

{#snippet accentBox(content: import("svelte").Snippet)}
  <AccentBox>{@render content()}</AccentBox>
{/snippet}

<Wrap if={wrapped} with={accentBox}><Text>Squadron</Text></Wrap>
