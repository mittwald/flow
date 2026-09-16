<!-- prettier-ignore -->
<!-- This file is auto-generated with the remote-components-generator -->
<script lang="ts">
  import type { RemoteListSummaryElementProps } from "@mittwald/flow-remote-elements";
  import { RemoteListSummaryElement } from "@mittwald/flow-remote-elements";
  import { useRemoteElementSync } from "../lib/remoteElementSync.svelte.js";
  import type { FlowRemoteProps } from "../lib/types.js";

  let { children, ...props }: FlowRemoteProps<RemoteListSummaryElementProps> = $props();

  // svelte-ignore state_referenced_locally
  const element = useRemoteElementSync(
    { tag: "flr-list-summary", name: "ListSummary", element: RemoteListSummaryElement },
    () => props,
  );

  const hasContent = $derived(
    children !== undefined,
  );
</script>

{#if hasContent}<flr-list-summary bind:this={element.node}>{@render children?.()}</flr-list-summary>{:else}<flr-list-summary bind:this={element.node}></flr-list-summary>{/if}
