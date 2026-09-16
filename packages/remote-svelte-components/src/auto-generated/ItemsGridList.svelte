<!-- prettier-ignore -->
<!-- This file is auto-generated with the remote-components-generator -->
<script lang="ts">
  import type { RemoteItemsGridListElementProps } from "@mittwald/flow-remote-elements";
  import { RemoteItemsGridListElement } from "@mittwald/flow-remote-elements";
  import RemoteElement from "../lib/RemoteElement.svelte";
  import type { FlowRemoteProps } from "../lib/types.js";

  let props: FlowRemoteProps<RemoteItemsGridListElementProps, "emptyView"> = $props();
</script>

<RemoteElement
  {...props}
  __flr={{ tag: "flr-items-grid-list", name: "ItemsGridList", element: RemoteItemsGridListElement, slotNames: ["emptyView"] }}
/>
