<!-- prettier-ignore -->
<!-- This file is auto-generated with the remote-components-generator -->
<script lang="ts">
  import type { RemoteItemsGridListElementProps } from "@mittwald/flow-remote-elements";
  import { RemoteItemsGridListElement } from "@mittwald/flow-remote-elements";
  import { useRemoteElementSync } from "../lib/remoteElementSync.svelte.js";
  import { slotAttribute } from "../lib/slotAttribute.js";
  import type { FlowRemoteProps } from "../lib/types.js";

  let { children, emptyView, ...props }: FlowRemoteProps<RemoteItemsGridListElementProps, "emptyView"> = $props();

  // svelte-ignore state_referenced_locally
  const element = useRemoteElementSync(
    { tag: "flr-items-grid-list", name: "ItemsGridList", element: RemoteItemsGridListElement },
    () => props,
  );

  const hasContent = $derived(
    children !== undefined ||
      emptyView !== undefined,
  );
</script>

{#if hasContent}<flr-items-grid-list bind:this={element.node}>{@render children?.()}{#if emptyView}<flr-slot-root-wrapper use:slotAttribute={"emptyView"}>{@render emptyView()}</flr-slot-root-wrapper>{/if}</flr-items-grid-list>{:else}<flr-items-grid-list bind:this={element.node}></flr-items-grid-list>{/if}
