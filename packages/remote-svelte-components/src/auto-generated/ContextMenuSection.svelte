<!-- prettier-ignore -->
<!-- This file is auto-generated with the remote-components-generator -->
<script lang="ts">
  import type { RemoteContextMenuSectionElementProps } from "@mittwald/flow-remote-elements";
  import { RemoteContextMenuSectionElement } from "@mittwald/flow-remote-elements";
  import { useRemoteElementSync } from "../lib/remoteElementSync.svelte.js";
  import type { FlowRemoteProps } from "../lib/types.js";

  let { children, ...props }: FlowRemoteProps<RemoteContextMenuSectionElementProps> = $props();

  // svelte-ignore state_referenced_locally
  const element = useRemoteElementSync(
    { tag: "flr-context-menu-section", name: "ContextMenuSection", element: RemoteContextMenuSectionElement },
    () => props,
  );

  const hasContent = $derived(
    children !== undefined,
  );
</script>

{#if hasContent}<flr-context-menu-section bind:this={element.node}>{@render children?.()}</flr-context-menu-section>{:else}<flr-context-menu-section bind:this={element.node}></flr-context-menu-section>{/if}
