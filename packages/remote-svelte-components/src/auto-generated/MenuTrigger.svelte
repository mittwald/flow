<!-- prettier-ignore -->
<!-- This file is auto-generated with the remote-components-generator -->
<script lang="ts">
  import type { RemoteMenuTriggerElementProps } from "@mittwald/flow-remote-elements";
  import { RemoteMenuTriggerElement } from "@mittwald/flow-remote-elements";
  import { useRemoteElementSync } from "../lib/remoteElementSync.svelte.js";
  import type { FlowRemoteProps } from "../lib/types.js";

  let { children, ...props }: FlowRemoteProps<RemoteMenuTriggerElementProps> = $props();

  // svelte-ignore state_referenced_locally
  const element = useRemoteElementSync(
    { tag: "flr-menu-trigger", name: "MenuTrigger", element: RemoteMenuTriggerElement },
    () => props,
  );

  const hasContent = $derived(
    children !== undefined,
  );
</script>

{#if hasContent}<flr-menu-trigger bind:this={element.node}>{@render children?.()}</flr-menu-trigger>{:else}<flr-menu-trigger bind:this={element.node}></flr-menu-trigger>{/if}
