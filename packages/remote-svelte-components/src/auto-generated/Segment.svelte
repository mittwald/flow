<!-- prettier-ignore -->
<!-- This file is auto-generated with the remote-components-generator -->
<script lang="ts">
  import type { RemoteSegmentElementProps } from "@mittwald/flow-remote-elements";
  import { RemoteSegmentElement } from "@mittwald/flow-remote-elements";
  import { useRemoteElementSync } from "../lib/remoteElementSync.svelte.js";
  import type { FlowRemoteProps } from "../lib/types.js";

  let { children, ...props }: FlowRemoteProps<RemoteSegmentElementProps> = $props();

  // svelte-ignore state_referenced_locally
  const element = useRemoteElementSync(
    { tag: "flr-segment", name: "Segment", element: RemoteSegmentElement },
    () => props,
  );

  const hasContent = $derived(
    children !== undefined,
  );
</script>

{#if hasContent}<flr-segment bind:this={element.node}>{@render children?.()}</flr-segment>{:else}<flr-segment bind:this={element.node}></flr-segment>{/if}
