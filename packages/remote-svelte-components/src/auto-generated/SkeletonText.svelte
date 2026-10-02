<!-- prettier-ignore -->
<!-- This file is auto-generated with the remote-components-generator -->
<script lang="ts">
  import type { RemoteSkeletonTextElementProps } from "@mittwald/flow-remote-elements";
  import { RemoteSkeletonTextElement } from "@mittwald/flow-remote-elements";
  import { useRemoteElementSync } from "../lib/remoteElementSync.svelte.js";
  import type { FlowRemoteProps } from "../lib/types.js";

  let { children, ...props }: FlowRemoteProps<RemoteSkeletonTextElementProps> = $props();

  // svelte-ignore state_referenced_locally
  const element = useRemoteElementSync(
    { tag: "flr-skeleton-text", name: "SkeletonText", element: RemoteSkeletonTextElement },
    () => props,
  );

  const hasContent = $derived(
    children !== undefined,
  );
</script>

{#if hasContent}<flr-skeleton-text bind:this={element.node}>{@render children?.()}</flr-skeleton-text>{:else}<flr-skeleton-text bind:this={element.node}></flr-skeleton-text>{/if}
