<!-- prettier-ignore -->
<!-- This file is auto-generated with the remote-components-generator -->
<script lang="ts">
  import type { RemoteMessageElementProps } from "@mittwald/flow-remote-elements";
  import { RemoteMessageElement } from "@mittwald/flow-remote-elements";
  import RemoteElement from "../lib/RemoteElement.svelte";
  import type { FlowRemoteProps } from "../lib/types.js";

  let props: FlowRemoteProps<RemoteMessageElementProps> = $props();
</script>

<RemoteElement
  tag="flr-message"
  name="Message"
  element={RemoteMessageElement}
  {...props}
/>
