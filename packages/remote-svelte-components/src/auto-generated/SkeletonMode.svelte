<!-- prettier-ignore -->
<!-- This file is auto-generated with the remote-components-generator -->
<script lang="ts">
  import type { RemoteSkeletonModeElementProps } from "@mittwald/flow-remote-elements";
  import { RemoteSkeletonModeElement } from "@mittwald/flow-remote-elements";
  import { useRemoteElementSync } from "../lib/remoteElementSync.svelte.js";
  import type { FlowRemoteProps } from "../lib/types.js";

  let { children, ...props }: FlowRemoteProps<RemoteSkeletonModeElementProps> = $props();

  // svelte-ignore state_referenced_locally
  const element = useRemoteElementSync(
    { tag: "flr-skeleton-mode", name: "SkeletonMode", element: RemoteSkeletonModeElement },
    () => props,
  );

  const hasContent = $derived(
    children !== undefined,
  );
</script>

{#if hasContent}<flr-skeleton-mode bind:this={element.node}>{@render children?.()}</flr-skeleton-mode>{:else}<flr-skeleton-mode bind:this={element.node}></flr-skeleton-mode>{/if}
