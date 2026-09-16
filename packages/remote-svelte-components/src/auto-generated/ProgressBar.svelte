<!-- prettier-ignore -->
<!-- This file is auto-generated with the remote-components-generator -->
<script lang="ts">
  import type { RemoteProgressBarElementProps } from "@mittwald/flow-remote-elements";
  import { RemoteProgressBarElement } from "@mittwald/flow-remote-elements";
  import RemoteElement from "../lib/RemoteElement.svelte";
  import type { FlowRemoteProps } from "../lib/types.js";

  let props: FlowRemoteProps<RemoteProgressBarElementProps, "valueLabel"> = $props();
</script>

<RemoteElement
  {...props}
  __flr={{ tag: "flr-progress-bar", name: "ProgressBar", element: RemoteProgressBarElement, slotNames: ["valueLabel"] }}
/>
