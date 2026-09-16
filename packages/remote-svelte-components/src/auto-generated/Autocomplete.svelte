<!-- prettier-ignore -->
<!-- This file is auto-generated with the remote-components-generator -->
<script lang="ts">
  import type { RemoteAutocompleteElementProps } from "@mittwald/flow-remote-elements";
  import { RemoteAutocompleteElement } from "@mittwald/flow-remote-elements";
  import { useRemoteElementSync } from "../lib/remoteElementSync.svelte.js";
  import type { FlowRemoteProps } from "../lib/types.js";

  let { children, ...props }: FlowRemoteProps<RemoteAutocompleteElementProps> = $props();

  // svelte-ignore state_referenced_locally
  const element = useRemoteElementSync(
    { tag: "flr-autocomplete", name: "Autocomplete", element: RemoteAutocompleteElement },
    () => props,
  );

  const hasContent = $derived(
    children !== undefined,
  );
</script>

{#if hasContent}<flr-autocomplete bind:this={element.node}>{@render children?.()}</flr-autocomplete>{:else}<flr-autocomplete bind:this={element.node}></flr-autocomplete>{/if}
