<!-- prettier-ignore -->
<!-- This file is auto-generated with the remote-components-generator -->
<script lang="ts">
  import type { RemoteSegmentedControlElementProps } from "@mittwald/flow-remote-elements";
  import { RemoteSegmentedControlElement } from "@mittwald/flow-remote-elements";
  import RemoteElement from "../lib/RemoteElement.svelte";
  import type { FlowRemoteProps } from "../lib/types.js";

  let props: FlowRemoteProps<RemoteSegmentedControlElementProps> = $props();
</script>

<RemoteElement
  tag="flr-segmented-control"
  name="SegmentedControl"
  element={RemoteSegmentedControlElement}
  {...props}
/>
