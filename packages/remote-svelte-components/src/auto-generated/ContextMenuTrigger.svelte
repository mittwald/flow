<!-- prettier-ignore -->
<!-- This file is auto-generated with the remote-components-generator -->
<script lang="ts">
  import type { RemoteContextMenuTriggerElementProps } from "@mittwald/flow-remote-elements";
  import { RemoteContextMenuTriggerElement } from "@mittwald/flow-remote-elements";
  import { useRemoteElementSync } from "../lib/remoteElementSync.svelte.js";
  import type { FlowRemoteProps } from "../lib/types.js";

  let { children, ...props }: FlowRemoteProps<RemoteContextMenuTriggerElementProps> = $props();

  // svelte-ignore state_referenced_locally
  const element = useRemoteElementSync(
    { tag: "flr-context-menu-trigger", name: "ContextMenuTrigger", element: RemoteContextMenuTriggerElement },
    () => props,
  );

  const hasContent = $derived(
    children !== undefined,
  );
</script>

{#if hasContent}<flr-context-menu-trigger bind:this={element.node}>{@render children?.()}</flr-context-menu-trigger>{:else}<flr-context-menu-trigger bind:this={element.node}></flr-context-menu-trigger>{/if}
