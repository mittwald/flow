<!-- prettier-ignore -->
<!-- This file is auto-generated with the remote-components-generator -->
<script lang="ts">
  import type { RemoteRatingElementProps } from "@mittwald/flow-remote-elements";
  import { RemoteRatingElement } from "@mittwald/flow-remote-elements";
  import { useRemoteElementSync } from "../lib/remoteElementSync.svelte.js";
  import { slotAttribute } from "../lib/slotAttribute.js";
  import type { FlowRemoteProps } from "../lib/types.js";

  let { children, iconEmpty, iconFilled, ...props }: FlowRemoteProps<RemoteRatingElementProps, "iconEmpty" | "iconFilled"> = $props();

  // svelte-ignore state_referenced_locally
  const element = useRemoteElementSync(
    { tag: "flr-rating", name: "Rating", element: RemoteRatingElement },
    () => props,
  );

  const hasContent = $derived(
    children !== undefined ||
      iconEmpty !== undefined ||
      iconFilled !== undefined,
  );
</script>

{#if hasContent}<flr-rating bind:this={element.node}>{@render children?.()}{#if iconEmpty}<flr-slot-root-wrapper use:slotAttribute={"iconEmpty"}>{@render iconEmpty()}</flr-slot-root-wrapper>{/if}{#if iconFilled}<flr-slot-root-wrapper use:slotAttribute={"iconFilled"}>{@render iconFilled()}</flr-slot-root-wrapper>{/if}</flr-rating>{:else}<flr-rating bind:this={element.node}></flr-rating>{/if}
