<!-- prettier-ignore -->
<!-- This file is auto-generated with the remote-components-generator -->
<script lang="ts">
  import type { RemoteChartGridElementProps } from "@mittwald/flow-remote-elements";
  import { RemoteChartGridElement } from "@mittwald/flow-remote-elements";
  import { useRemoteElementSync } from "../lib/remoteElementSync.svelte.js";
  import type { FlowRemoteProps } from "../lib/types.js";

  let { children, ...props }: FlowRemoteProps<RemoteChartGridElementProps> = $props();

  // svelte-ignore state_referenced_locally
  const element = useRemoteElementSync(
    { tag: "flr-chart-grid", name: "ChartGrid", element: RemoteChartGridElement },
    () => props,
  );

  const hasContent = $derived(
    children !== undefined,
  );
</script>

{#if hasContent}<flr-chart-grid bind:this={element.node}>{@render children?.()}</flr-chart-grid>{:else}<flr-chart-grid bind:this={element.node}></flr-chart-grid>{/if}
