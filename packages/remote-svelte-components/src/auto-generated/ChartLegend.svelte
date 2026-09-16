<!-- prettier-ignore -->
<!-- This file is auto-generated with the remote-components-generator -->
<script lang="ts">
  import type { RemoteChartLegendElementProps } from "@mittwald/flow-remote-elements";
  import { RemoteChartLegendElement } from "@mittwald/flow-remote-elements";
  import { useRemoteElementSync } from "../lib/remoteElementSync.svelte.js";
  import type { FlowRemoteProps } from "../lib/types.js";

  let { children, ...props }: FlowRemoteProps<RemoteChartLegendElementProps> = $props();

  // svelte-ignore state_referenced_locally
  const element = useRemoteElementSync(
    { tag: "flr-chart-legend", name: "ChartLegend", element: RemoteChartLegendElement },
    () => props,
  );

  const hasContent = $derived(
    children !== undefined,
  );
</script>

{#if hasContent}<flr-chart-legend bind:this={element.node}>{@render children?.()}</flr-chart-legend>{:else}<flr-chart-legend bind:this={element.node}></flr-chart-legend>{/if}
