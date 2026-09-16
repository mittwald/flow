<!-- prettier-ignore -->
<!-- This file is auto-generated with the remote-components-generator -->
<script lang="ts">
  import type { RemoteDonutChartElementProps } from "@mittwald/flow-remote-elements";
  import { RemoteDonutChartElement } from "@mittwald/flow-remote-elements";
  import { useRemoteElementSync } from "../lib/remoteElementSync.svelte.js";
  import type { FlowRemoteProps } from "../lib/types.js";

  let { children, ...props }: FlowRemoteProps<RemoteDonutChartElementProps> = $props();

  // svelte-ignore state_referenced_locally
  const element = useRemoteElementSync(
    { tag: "flr-donut-chart", name: "DonutChart", element: RemoteDonutChartElement },
    () => props,
  );

  const hasContent = $derived(
    children !== undefined,
  );
</script>

{#if hasContent}<flr-donut-chart bind:this={element.node}>{@render children?.()}</flr-donut-chart>{:else}<flr-donut-chart bind:this={element.node}></flr-donut-chart>{/if}
