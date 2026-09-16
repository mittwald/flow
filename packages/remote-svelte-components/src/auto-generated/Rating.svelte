<!-- prettier-ignore -->
<!-- This file is auto-generated with the remote-components-generator -->
<script lang="ts">
  import type { RemoteRatingElementProps } from "@mittwald/flow-remote-elements";
  import { RemoteRatingElement } from "@mittwald/flow-remote-elements";
  import RemoteElement from "../lib/RemoteElement.svelte";
  import type { FlowRemoteProps } from "../lib/types.js";

  let props: FlowRemoteProps<RemoteRatingElementProps, "iconEmpty" | "iconFilled"> = $props();
</script>

<RemoteElement
  tag="flr-rating"
  name="Rating"
  element={RemoteRatingElement}
  slotNames={["iconEmpty", "iconFilled"]}
  {...props}
/>
