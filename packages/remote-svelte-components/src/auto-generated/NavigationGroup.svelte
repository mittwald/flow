<!-- prettier-ignore -->
<!-- This file is auto-generated with the remote-components-generator -->
<script lang="ts">
  import type { RemoteNavigationGroupElementProps } from "@mittwald/flow-remote-elements";
  import { RemoteNavigationGroupElement } from "@mittwald/flow-remote-elements";
  import { useRemoteElementSync } from "../lib/remoteElementSync.svelte.js";
  import type { FlowRemoteProps } from "../lib/types.js";

  let { children, ...props }: FlowRemoteProps<RemoteNavigationGroupElementProps> = $props();

  // svelte-ignore state_referenced_locally
  const element = useRemoteElementSync(
    { tag: "flr-navigation-group", name: "NavigationGroup", element: RemoteNavigationGroupElement },
    () => props,
  );

  const hasContent = $derived(
    children !== undefined,
  );
</script>

{#if hasContent}<flr-navigation-group bind:this={element.node}>{@render children?.()}</flr-navigation-group>{:else}<flr-navigation-group bind:this={element.node}></flr-navigation-group>{/if}
