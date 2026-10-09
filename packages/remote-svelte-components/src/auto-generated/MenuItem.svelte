<!-- prettier-ignore -->
<!-- This file is auto-generated with the remote-components-generator -->
<script lang="ts">
  import type { RemoteMenuItemElementProps } from "@mittwald/flow-remote-elements";
  import { RemoteMenuItemElement } from "@mittwald/flow-remote-elements";
  import { useRemoteElementSync } from "../lib/remoteElementSync.svelte.js";
  import type { FlowRemoteProps } from "../lib/types.js";

  let { children, ...props }: FlowRemoteProps<RemoteMenuItemElementProps> = $props();

  // svelte-ignore state_referenced_locally
  const element = useRemoteElementSync(
    { tag: "flr-menu-item", name: "MenuItem", element: RemoteMenuItemElement },
    () => props,
  );

  const hasContent = $derived(
    children !== undefined,
  );
</script>

{#if hasContent}<flr-menu-item bind:this={element.node}>{@render children?.()}</flr-menu-item>{:else}<flr-menu-item bind:this={element.node}></flr-menu-item>{/if}
