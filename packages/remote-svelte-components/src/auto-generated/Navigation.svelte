<!-- prettier-ignore -->
<!-- This file is auto-generated with the remote-components-generator -->
<script lang="ts">
  import type { RemoteNavigationElementProps } from "@mittwald/flow-remote-elements";
  import { RemoteNavigationElement } from "@mittwald/flow-remote-elements";
  import { useRemoteElementSync } from "../lib/remoteElementSync.svelte.js";
  import type { FlowRemoteProps } from "../lib/types.js";

  let { children, ...props }: FlowRemoteProps<RemoteNavigationElementProps> = $props();

  // svelte-ignore state_referenced_locally
  const element = useRemoteElementSync(
    { tag: "flr-navigation", name: "Navigation", element: RemoteNavigationElement },
    () => props,
  );

  const hasContent = $derived(
    children !== undefined,
  );
</script>

{#if hasContent}<flr-navigation bind:this={element.node}>{@render children?.()}</flr-navigation>{:else}<flr-navigation bind:this={element.node}></flr-navigation>{/if}
