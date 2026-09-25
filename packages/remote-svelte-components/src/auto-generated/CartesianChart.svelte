<!-- prettier-ignore -->
<!-- This file is auto-generated with the remote-components-generator -->
<script lang="ts">
  import type { RemoteCartesianChartElementProps } from "@mittwald/flow-remote-elements";
  import { RemoteCartesianChartElement } from "@mittwald/flow-remote-elements";
  import { useRemoteElementSync } from "../lib/remoteElementSync.svelte.js";
  import { slotAttribute } from "../lib/slotAttribute.js";
  import type { FlowRemoteProps } from "../lib/types.js";

  let { children, emptyView, ...props }: FlowRemoteProps<RemoteCartesianChartElementProps, "emptyView"> = $props();

  // svelte-ignore state_referenced_locally
  const element = useRemoteElementSync(
    { tag: "flr-cartesian-chart", name: "CartesianChart", element: RemoteCartesianChartElement },
    () => props,
  );

  const hasContent = $derived(
    children !== undefined ||
      emptyView !== undefined,
  );
</script>

{#if hasContent}<flr-cartesian-chart bind:this={element.node}>{@render children?.()}{#if emptyView}<flr-slot-root-wrapper use:slotAttribute={"emptyView"}>{@render emptyView()}</flr-slot-root-wrapper>{/if}</flr-cartesian-chart>{:else}<flr-cartesian-chart bind:this={element.node}></flr-cartesian-chart>{/if}
