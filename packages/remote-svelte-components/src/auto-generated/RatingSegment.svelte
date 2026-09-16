<!-- prettier-ignore -->
<!-- This file is auto-generated with the remote-components-generator -->
<script lang="ts">
  import type { RemoteRatingSegmentElementProps } from "@mittwald/flow-remote-elements";
  import { RemoteRatingSegmentElement } from "@mittwald/flow-remote-elements";
  import RemoteElement from "../lib/RemoteElement.svelte";
  import type { FlowRemoteProps } from "../lib/types.js";

  let props: FlowRemoteProps<RemoteRatingSegmentElementProps, "iconEmpty" | "iconFilled"> = $props();
</script>

<RemoteElement
  {...props}
  __flr={{ tag: "flr-rating-segment", name: "RatingSegment", element: RemoteRatingSegmentElement, slotNames: ["iconEmpty", "iconFilled"] }}
/>
