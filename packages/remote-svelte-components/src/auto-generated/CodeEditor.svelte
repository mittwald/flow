<!-- prettier-ignore -->
<!-- This file is auto-generated with the remote-components-generator -->
<script lang="ts">
  import type { RemoteCodeEditorElementProps } from "@mittwald/flow-remote-elements";
  import { RemoteCodeEditorElement } from "@mittwald/flow-remote-elements";
  import RemoteElement from "../lib/RemoteElement.svelte";
  import type { FlowRemoteProps } from "../lib/types.js";

  let props: FlowRemoteProps<RemoteCodeEditorElementProps> = $props();
</script>

<RemoteElement
  tag="flr-code-editor"
  name="CodeEditor"
  element={RemoteCodeEditorElement}
  {...props}
/>
