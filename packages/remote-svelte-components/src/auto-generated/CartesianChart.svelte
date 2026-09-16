<!-- prettier-ignore -->
<!-- This file is auto-generated with the remote-components-generator -->
<script lang="ts">
  import type { RemoteCartesianChartElementProps } from "@mittwald/flow-remote-elements";
  import { RemoteCartesianChartElement } from "@mittwald/flow-remote-elements";
  import RemoteElement from "../lib/RemoteElement.svelte";
  import type { FlowRemoteProps } from "../lib/types.js";

  let props: FlowRemoteProps<RemoteCartesianChartElementProps, "emptyView"> = $props();
</script>

<RemoteElement
  tag="flr-cartesian-chart"
  name="CartesianChart"
  element={RemoteCartesianChartElement}
  slotNames={["emptyView"]}
  {...props}
/>
