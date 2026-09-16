<!-- prettier-ignore -->
<!-- This file is auto-generated with the remote-components-generator -->
<script lang="ts">
  import type { RemoteLayoutCardElementProps } from "@mittwald/flow-remote-elements";
  import { RemoteLayoutCardElement } from "@mittwald/flow-remote-elements";
  import { useRemoteElementSync } from "../lib/remoteElementSync.svelte.js";
  import type { FlowRemoteProps } from "../lib/types.js";

  let { children, ...props }: FlowRemoteProps<RemoteLayoutCardElementProps> = $props();

  // svelte-ignore state_referenced_locally
  const element = useRemoteElementSync(
    { tag: "flr-layout-card", name: "LayoutCard", element: RemoteLayoutCardElement },
    () => props,
  );

  const hasContent = $derived(
    children !== undefined,
  );
</script>

{#if hasContent}<flr-layout-card bind:this={element.node}>{@render children?.()}</flr-layout-card>{:else}<flr-layout-card bind:this={element.node}></flr-layout-card>{/if}
