<!-- prettier-ignore -->
<!-- This file is auto-generated with the remote-components-generator -->
<script lang="ts">
  import type { RemoteMessageThreadElementProps } from "@mittwald/flow-remote-elements";
  import { RemoteMessageThreadElement } from "@mittwald/flow-remote-elements";
  import RemoteElement from "../lib/RemoteElement.svelte";
  import type { FlowRemoteProps } from "../lib/types.js";

  let props: FlowRemoteProps<RemoteMessageThreadElementProps> = $props();
</script>

<RemoteElement
  tag="flr-message-thread"
  name="MessageThread"
  element={RemoteMessageThreadElement}
  {...props}
/>
