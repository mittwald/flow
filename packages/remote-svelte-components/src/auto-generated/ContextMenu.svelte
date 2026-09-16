<!-- prettier-ignore -->
<!-- This file is auto-generated with the remote-components-generator -->
<script lang="ts">
  import type { RemoteContextMenuElementProps } from "@mittwald/flow-remote-elements";
  import { RemoteContextMenuElement } from "@mittwald/flow-remote-elements";
  import { useRemoteElementSync } from "../lib/remoteElementSync.svelte.js";
  import type { FlowRemoteProps } from "../lib/types.js";

  let { children, ...props }: FlowRemoteProps<RemoteContextMenuElementProps> = $props();

  // svelte-ignore state_referenced_locally
  const element = useRemoteElementSync(
    { tag: "flr-context-menu", name: "ContextMenu", element: RemoteContextMenuElement },
    () => props,
  );

  const hasContent = $derived(
    children !== undefined,
  );
</script>

{#if hasContent}<flr-context-menu bind:this={element.node}>{@render children?.()}</flr-context-menu>{:else}<flr-context-menu bind:this={element.node}></flr-context-menu>{/if}
