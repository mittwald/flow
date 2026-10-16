<!-- prettier-ignore -->
<!-- This file is auto-generated with the remote-components-generator -->
<script lang="ts">
  import type { RemoteRatingSegmentElementProps } from "@mittwald/flow-remote-elements";
  import { RemoteRatingSegmentElement } from "@mittwald/flow-remote-elements";
  import { useRemoteElementSync } from "../lib/remoteElementSync.svelte.js";
  import { slotAttribute } from "../lib/slotAttribute.js";
  import type { FlowRemoteProps } from "../lib/types.js";

  let { children, iconEmpty, iconFilled, ...props }: FlowRemoteProps<RemoteRatingSegmentElementProps, "iconEmpty" | "iconFilled"> = $props();

  // svelte-ignore state_referenced_locally
  const element = useRemoteElementSync(
    { tag: "flr-rating-segment", name: "RatingSegment", element: RemoteRatingSegmentElement },
    () => props,
  );

  const hasContent = $derived(
    children !== undefined ||
      iconEmpty !== undefined ||
      iconFilled !== undefined,
  );
</script>

{#if hasContent}<flr-rating-segment bind:this={element.node}>{@render children?.()}{#if iconEmpty}<flr-slot-root-wrapper use:slotAttribute={"iconEmpty"}>{@render iconEmpty()}</flr-slot-root-wrapper>{/if}{#if iconFilled}<flr-slot-root-wrapper use:slotAttribute={"iconFilled"}>{@render iconFilled()}</flr-slot-root-wrapper>{/if}</flr-rating-segment>{:else}<flr-rating-segment bind:this={element.node}></flr-rating-segment>{/if}
