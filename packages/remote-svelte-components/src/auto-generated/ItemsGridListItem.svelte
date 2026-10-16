<!-- prettier-ignore -->
<!-- This file is auto-generated with the remote-components-generator -->
<script lang="ts">
  import type { RemoteItemsGridListItemElementProps } from "@mittwald/flow-remote-elements";
  import { RemoteItemsGridListItemElement } from "@mittwald/flow-remote-elements";
  import { useRemoteElementSync } from "../lib/remoteElementSync.svelte.js";
  import type { FlowRemoteProps } from "../lib/types.js";

  let { children, ...props }: FlowRemoteProps<RemoteItemsGridListItemElementProps> = $props();

  // svelte-ignore state_referenced_locally
  const element = useRemoteElementSync(
    { tag: "flr-items-grid-list-item", name: "ItemsGridListItem", element: RemoteItemsGridListItemElement },
    () => props,
  );

  const hasContent = $derived(
    children !== undefined,
  );
</script>

{#if hasContent}<flr-items-grid-list-item bind:this={element.node}>{@render children?.()}</flr-items-grid-list-item>{:else}<flr-items-grid-list-item bind:this={element.node}></flr-items-grid-list-item>{/if}
