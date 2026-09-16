<!-- prettier-ignore -->
<!-- This file is auto-generated with the remote-components-generator -->
<script lang="ts">
  import type { RemoteSearchFieldElementProps } from "@mittwald/flow-remote-elements";
  import { RemoteSearchFieldElement } from "@mittwald/flow-remote-elements";
  import { useRemoteElementSync } from "../lib/remoteElementSync.svelte.js";
  import type { FlowRemoteProps } from "../lib/types.js";

  let { children, ...props }: FlowRemoteProps<RemoteSearchFieldElementProps> = $props();

  // svelte-ignore state_referenced_locally
  const element = useRemoteElementSync(
    { tag: "flr-search-field", name: "SearchField", element: RemoteSearchFieldElement },
    () => props,
  );

  const hasContent = $derived(
    children !== undefined,
  );
</script>

{#if hasContent}<flr-search-field bind:this={element.node}>{@render children?.()}</flr-search-field>{:else}<flr-search-field bind:this={element.node}></flr-search-field>{/if}
