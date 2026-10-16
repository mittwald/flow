<script lang="ts">
  import Flex from "../../auto-generated/Flex.svelte";
  import IconSetProvider from "../../components/IconSetProvider.svelte";
  import IconInfo from "../../icons/IconInfo.svelte";
  import IconStar from "../../icons/IconStar.svelte";
  import ReplacementIcon from "./ReplacementIcon.svelte";

  const { replace = false }: { replace?: boolean } = $props();

  /* Only `Info` is replaced — `Star` has to keep Flow's own. */
  const set = { Info: ReplacementIcon };
</script>

{#if replace}<IconSetProvider {set}><Flex gap="s"><IconInfo
        size="s"
      /><IconStar /></Flex></IconSetProvider>{:else}<Flex gap="s"><IconInfo
      size="s"
    /><IconStar /></Flex>{/if}
