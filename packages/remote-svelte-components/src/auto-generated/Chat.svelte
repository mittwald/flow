<!-- prettier-ignore -->
<!-- This file is auto-generated with the remote-components-generator -->
<script lang="ts">
  import type { RemoteChatElementProps } from "@mittwald/flow-remote-elements";
  import { RemoteChatElement } from "@mittwald/flow-remote-elements";
  import RemoteElement from "../lib/RemoteElement.svelte";
  import type { FlowRemoteProps } from "../lib/types.js";

  let props: FlowRemoteProps<RemoteChatElementProps> = $props();
</script>

<RemoteElement
  tag="flr-chat"
  name="Chat"
  element={RemoteChatElement}
  {...props}
/>
