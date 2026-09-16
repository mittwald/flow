<!-- prettier-ignore -->
<!-- This file is auto-generated with the remote-components-generator -->
<script lang="ts">
  import type { RemoteSelectElementProps } from "@mittwald/flow-remote-elements";
  import { RemoteSelectElement } from "@mittwald/flow-remote-elements";
  import RemoteElement from "../lib/RemoteElement.svelte";
  import type { FlowRemoteProps } from "../lib/types.js";

  let props: FlowRemoteProps<RemoteSelectElementProps> = $props();
</script>

<RemoteElement
  tag="flr-select"
  name="Select"
  element={RemoteSelectElement}
  {...props}
/>
