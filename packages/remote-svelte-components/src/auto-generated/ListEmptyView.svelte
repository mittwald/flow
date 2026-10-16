<!-- prettier-ignore -->
<!-- This file is auto-generated with the remote-components-generator -->
<script lang="ts">
  import type { RemoteListEmptyViewElementProps } from "@mittwald/flow-remote-elements";
  import { RemoteListEmptyViewElement } from "@mittwald/flow-remote-elements";
  import { useRemoteElementSync } from "../lib/remoteElementSync.svelte.js";
  import type { FlowRemoteProps } from "../lib/types.js";

  let { children, ...props }: FlowRemoteProps<RemoteListEmptyViewElementProps> = $props();

  // svelte-ignore state_referenced_locally
  const element = useRemoteElementSync(
    { tag: "flr-list-empty-view", name: "ListEmptyView", element: RemoteListEmptyViewElement },
    () => props,
  );

  const hasContent = $derived(
    children !== undefined,
  );
</script>

{#if hasContent}<flr-list-empty-view bind:this={element.node}>{@render children?.()}</flr-list-empty-view>{:else}<flr-list-empty-view bind:this={element.node}></flr-list-empty-view>{/if}
