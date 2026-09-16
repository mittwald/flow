<!-- prettier-ignore -->
<!-- This file is auto-generated with the remote-components-generator -->
<script lang="ts">
  import type { RemoteHeaderElementProps } from "@mittwald/flow-remote-elements";
  import { RemoteHeaderElement } from "@mittwald/flow-remote-elements";
  import RemoteElement from "../lib/RemoteElement.svelte";
  import type { FlowRemoteProps } from "../lib/types.js";

  let props: FlowRemoteProps<RemoteHeaderElementProps> = $props();
</script>

<RemoteElement
  tag="flr-header"
  name="Header"
  element={RemoteHeaderElement}
  {...props}
/>
