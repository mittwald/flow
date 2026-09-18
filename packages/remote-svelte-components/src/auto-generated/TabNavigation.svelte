<!-- prettier-ignore -->
<!-- This file is auto-generated with the remote-components-generator -->
<script lang="ts">
  import type { RemoteTabNavigationElementProps } from "@mittwald/flow-remote-elements";
  import { RemoteTabNavigationElement } from "@mittwald/flow-remote-elements";
  import { useRemoteElementSync } from "../lib/remoteElementSync.svelte.js";
  import type { FlowRemoteProps } from "../lib/types.js";

  let { children, ...props }: FlowRemoteProps<RemoteTabNavigationElementProps> = $props();

  // svelte-ignore state_referenced_locally
  const element = useRemoteElementSync(
    { tag: "flr-tab-navigation", name: "TabNavigation", element: RemoteTabNavigationElement },
    () => props,
  );

  const hasContent = $derived(
    children !== undefined,
  );
</script>

{#if hasContent}<flr-tab-navigation bind:this={element.node}>{@render children?.()}</flr-tab-navigation>{:else}<flr-tab-navigation bind:this={element.node}></flr-tab-navigation>{/if}
