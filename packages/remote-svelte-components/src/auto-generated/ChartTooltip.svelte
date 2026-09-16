<!-- prettier-ignore -->
<!-- This file is auto-generated with the remote-components-generator -->
<script lang="ts">
  import type { RemoteChartTooltipElementProps } from "@mittwald/flow-remote-elements";
  import { RemoteChartTooltipElement } from "@mittwald/flow-remote-elements";
  import { useRemoteElementSync } from "../lib/remoteElementSync.svelte.js";
  import type { FlowRemoteProps } from "../lib/types.js";

  let { children, ...props }: FlowRemoteProps<RemoteChartTooltipElementProps> = $props();

  // svelte-ignore state_referenced_locally
  const element = useRemoteElementSync(
    { tag: "flr-chart-tooltip", name: "ChartTooltip", element: RemoteChartTooltipElement },
    () => props,
  );

  const hasContent = $derived(
    children !== undefined,
  );
</script>

{#if hasContent}<flr-chart-tooltip bind:this={element.node}>{@render children?.()}</flr-chart-tooltip>{:else}<flr-chart-tooltip bind:this={element.node}></flr-chart-tooltip>{/if}
