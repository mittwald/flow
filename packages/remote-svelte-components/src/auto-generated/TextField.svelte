<!-- prettier-ignore -->
<!-- This file is auto-generated with the remote-components-generator -->
<script lang="ts">
  import type { RemoteTextFieldElementProps } from "@mittwald/flow-remote-elements";
  import { RemoteTextFieldElement } from "@mittwald/flow-remote-elements";
  import RemoteElement from "../lib/RemoteElement.svelte";
  import type { FlowRemoteProps } from "../lib/types.js";

  let props: FlowRemoteProps<RemoteTextFieldElementProps> = $props();
</script>

<RemoteElement
  tag="flr-text-field"
  name="TextField"
  element={RemoteTextFieldElement}
  {...props}
/>
