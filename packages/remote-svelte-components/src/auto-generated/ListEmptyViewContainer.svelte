<!-- prettier-ignore -->
<!-- This file is auto-generated with the remote-components-generator -->
<script lang="ts">
  import type { RemoteListEmptyViewContainerElementProps } from "@mittwald/flow-remote-elements";
  import { RemoteListEmptyViewContainerElement } from "@mittwald/flow-remote-elements";
  import RemoteElement from "../lib/RemoteElement.svelte";
  import type { FlowRemoteProps } from "../lib/types.js";

  let props: FlowRemoteProps<RemoteListEmptyViewContainerElementProps, "emptySearchResultView" | "emptyView"> = $props();
</script>

<RemoteElement
  {...props}
  __flr={{ tag: "flr-list-empty-view-container", name: "ListEmptyViewContainer", element: RemoteListEmptyViewContainerElement, slotNames: ["emptySearchResultView", "emptyView"] }}
/>
