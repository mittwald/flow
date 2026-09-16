<!-- prettier-ignore -->
<!-- This file is auto-generated with the remote-components-generator -->
<script lang="ts">
  import type { RemoteTabsElementProps } from "@mittwald/flow-remote-elements";
  import { RemoteTabsElement } from "@mittwald/flow-remote-elements";
  import RemoteElement from "../lib/RemoteElement.svelte";
  import type { FlowRemoteProps } from "../lib/types.js";

  let props: FlowRemoteProps<RemoteTabsElementProps, "tabNotFoundView"> = $props();
</script>

<RemoteElement
  tag="flr-tabs"
  name="Tabs"
  element={RemoteTabsElement}
  slotNames={["tabNotFoundView"]}
  {...props}
/>
