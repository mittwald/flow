<!-- prettier-ignore -->
<!-- This file is auto-generated with the remote-components-generator -->
<script lang="ts">
  import type { RemoteHeaderNavigationElementProps } from "@mittwald/flow-remote-elements";
  import { RemoteHeaderNavigationElement } from "@mittwald/flow-remote-elements";
  import { useRemoteElementSync } from "../lib/remoteElementSync.svelte.js";
  import type { FlowRemoteProps } from "../lib/types.js";

  let { children, ...props }: FlowRemoteProps<RemoteHeaderNavigationElementProps> = $props();

  // svelte-ignore state_referenced_locally
  const element = useRemoteElementSync(
    { tag: "flr-header-navigation", name: "HeaderNavigation", element: RemoteHeaderNavigationElement },
    () => props,
  );

  const hasContent = $derived(
    children !== undefined,
  );
</script>

{#if hasContent}<flr-header-navigation bind:this={element.node}>{@render children?.()}</flr-header-navigation>{:else}<flr-header-navigation bind:this={element.node}></flr-header-navigation>{/if}
