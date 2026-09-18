<!-- prettier-ignore -->
<!-- This file is auto-generated with the remote-components-generator -->
<script lang="ts">
  import type { RemoteSkeletonElementProps } from "@mittwald/flow-remote-elements";
  import { RemoteSkeletonElement } from "@mittwald/flow-remote-elements";
  import { useRemoteElementSync } from "../lib/remoteElementSync.svelte.js";
  import type { FlowRemoteProps } from "../lib/types.js";

  let { children, ...props }: FlowRemoteProps<RemoteSkeletonElementProps> = $props();

  // svelte-ignore state_referenced_locally
  const element = useRemoteElementSync(
    { tag: "flr-skeleton", name: "Skeleton", element: RemoteSkeletonElement },
    () => props,
  );

  const hasContent = $derived(
    children !== undefined,
  );
</script>

{#if hasContent}<flr-skeleton bind:this={element.node}>{@render children?.()}</flr-skeleton>{:else}<flr-skeleton bind:this={element.node}></flr-skeleton>{/if}
