<!-- prettier-ignore -->
<!-- This file is auto-generated with the remote-components-generator -->
<script lang="ts">
  import type { RemoteTimeFieldElementProps } from "@mittwald/flow-remote-elements";
  import { RemoteTimeFieldElement } from "@mittwald/flow-remote-elements";
  import RemoteElement from "../lib/RemoteElement.svelte";
  import type { FlowRemoteProps } from "../lib/types.js";

  let props: FlowRemoteProps<RemoteTimeFieldElementProps> = $props();
</script>

<RemoteElement
  tag="flr-time-field"
  name="TimeField"
  element={RemoteTimeFieldElement}
  {...props}
/>
