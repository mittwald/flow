<!-- prettier-ignore -->
<!-- This file is auto-generated with the remote-components-generator -->
<script lang="ts">
  import type { RemoteListItemViewContentElementProps } from "@mittwald/flow-remote-elements";
  import { RemoteListItemViewContentElement } from "@mittwald/flow-remote-elements";
  import RemoteElement from "../lib/RemoteElement.svelte";
  import type { FlowRemoteProps } from "../lib/types.js";

  let props: FlowRemoteProps<RemoteListItemViewContentElementProps, "avatar" | "bottom" | "button" | "checkbox" | "subTitle" | "title"> = $props();
</script>

<RemoteElement
  tag="flr-list-item-view-content"
  name="ListItemViewContent"
  element={RemoteListItemViewContentElement}
  slotNames={["avatar", "bottom", "button", "checkbox", "subTitle", "title"]}
  {...props}
/>
