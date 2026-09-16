<!-- prettier-ignore -->
<!-- This file is auto-generated with the remote-components-generator -->
<script lang="ts">
  import type { RemoteTooltipElementProps } from "@mittwald/flow-remote-elements";
  import { RemoteTooltipElement } from "@mittwald/flow-remote-elements";
  import RemoteElement from "../lib/RemoteElement.svelte";
  import type { FlowRemoteProps } from "../lib/types.js";

  let props: FlowRemoteProps<RemoteTooltipElementProps> = $props();
</script>

<RemoteElement
  tag="flr-tooltip"
  name="Tooltip"
  element={RemoteTooltipElement}
  {...props}
/>
