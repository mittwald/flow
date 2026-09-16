<!-- prettier-ignore -->
<!-- This file is auto-generated with the remote-components-generator -->
<script lang="ts">
  import type { RemoteMarkdownElementProps } from "@mittwald/flow-remote-elements";
  import { RemoteMarkdownElement } from "@mittwald/flow-remote-elements";
  import RemoteElement from "../lib/RemoteElement.svelte";
  import type { FlowRemoteProps } from "../lib/types.js";

  let props: FlowRemoteProps<RemoteMarkdownElementProps> = $props();
</script>

<RemoteElement
  tag="flr-markdown"
  name="Markdown"
  element={RemoteMarkdownElement}
  {...props}
/>
