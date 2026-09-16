<!-- prettier-ignore -->
<!-- This file is auto-generated with the remote-components-generator -->
<script lang="ts">
  import type { RemoteSearchFieldElementProps } from "@mittwald/flow-remote-elements";
  import { RemoteSearchFieldElement } from "@mittwald/flow-remote-elements";
  import RemoteElement from "../lib/RemoteElement.svelte";
  import type { FlowRemoteProps } from "../lib/types.js";

  let props: FlowRemoteProps<RemoteSearchFieldElementProps> = $props();
</script>

<RemoteElement
  tag="flr-search-field"
  name="SearchField"
  element={RemoteSearchFieldElement}
  {...props}
/>
