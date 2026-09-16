<!-- prettier-ignore -->
<!-- This file is auto-generated with the remote-components-generator -->
<script lang="ts">
  import type { RemoteContextMenuContentElementProps } from "@mittwald/flow-remote-elements";
  import { RemoteContextMenuContentElement } from "@mittwald/flow-remote-elements";
  import { useRemoteElementSync } from "../lib/remoteElementSync.svelte.js";
  import type { FlowRemoteProps } from "../lib/types.js";

  let { children, ...props }: FlowRemoteProps<RemoteContextMenuContentElementProps> = $props();

  // svelte-ignore state_referenced_locally
  const element = useRemoteElementSync(
    { tag: "flr-context-menu-content", name: "ContextMenuContent", element: RemoteContextMenuContentElement },
    () => props,
  );

  const hasContent = $derived(
    children !== undefined,
  );
</script>

{#if hasContent}<flr-context-menu-content bind:this={element.node}>{@render children?.()}</flr-context-menu-content>{:else}<flr-context-menu-content bind:this={element.node}></flr-context-menu-content>{/if}
