<!-- prettier-ignore -->
<!-- This file is auto-generated with the remote-components-generator -->
<script lang="ts">
  import type { RemoteBarElementProps } from "@mittwald/flow-remote-elements";
  import { RemoteBarElement } from "@mittwald/flow-remote-elements";
  import RemoteElement from "../lib/RemoteElement.svelte";
  import type { FlowRemoteProps } from "../lib/types.js";

  let props: FlowRemoteProps<RemoteBarElementProps> = $props();
</script>

<RemoteElement
  tag="flr-bar"
  name="Bar"
  element={RemoteBarElement}
  {...props}
/>
