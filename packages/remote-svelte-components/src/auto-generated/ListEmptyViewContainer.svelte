<!-- prettier-ignore -->
<!-- This file is auto-generated with the remote-components-generator -->
<script lang="ts">
  import type { RemoteListEmptyViewContainerElementProps } from "@mittwald/flow-remote-elements";
  import { RemoteListEmptyViewContainerElement } from "@mittwald/flow-remote-elements";
  import { useRemoteElementSync } from "../lib/remoteElementSync.svelte.js";
  import { slotAttribute } from "../lib/slotAttribute.js";
  import type { FlowRemoteProps } from "../lib/types.js";

  let { children, emptySearchResultView, emptyView, ...props }: FlowRemoteProps<RemoteListEmptyViewContainerElementProps, "emptySearchResultView" | "emptyView"> = $props();

  // svelte-ignore state_referenced_locally
  const element = useRemoteElementSync(
    { tag: "flr-list-empty-view-container", name: "ListEmptyViewContainer", element: RemoteListEmptyViewContainerElement },
    () => props,
  );

  const hasContent = $derived(
    children !== undefined ||
      emptySearchResultView !== undefined ||
      emptyView !== undefined,
  );
</script>

{#if hasContent}<flr-list-empty-view-container bind:this={element.node}>{@render children?.()}{#if emptySearchResultView}<flr-slot-root-wrapper use:slotAttribute={"emptySearchResultView"}>{@render emptySearchResultView()}</flr-slot-root-wrapper>{/if}{#if emptyView}<flr-slot-root-wrapper use:slotAttribute={"emptyView"}>{@render emptyView()}</flr-slot-root-wrapper>{/if}</flr-list-empty-view-container>{:else}<flr-list-empty-view-container bind:this={element.node}></flr-list-empty-view-container>{/if}
