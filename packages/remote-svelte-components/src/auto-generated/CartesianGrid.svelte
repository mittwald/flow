<!-- prettier-ignore -->
<!-- This file is auto-generated with the remote-components-generator -->
<script lang="ts">
  import type { RemoteCartesianGridElementProps } from "@mittwald/flow-remote-elements";
  import { RemoteCartesianGridElement } from "@mittwald/flow-remote-elements";
  import { useRemoteElementSync } from "../lib/remoteElementSync.svelte.js";
  import type { FlowRemoteProps } from "../lib/types.js";

  let { children, ...props }: FlowRemoteProps<RemoteCartesianGridElementProps> = $props();

  // svelte-ignore state_referenced_locally
  const element = useRemoteElementSync(
    { tag: "flr-cartesian-grid", name: "CartesianGrid", element: RemoteCartesianGridElement },
    () => props,
  );

  const hasContent = $derived(
    children !== undefined,
  );
</script>

{#if hasContent}<flr-cartesian-grid bind:this={element.node}>{@render children?.()}</flr-cartesian-grid>{:else}<flr-cartesian-grid bind:this={element.node}></flr-cartesian-grid>{/if}
