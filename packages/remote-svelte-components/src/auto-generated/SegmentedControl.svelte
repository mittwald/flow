<!-- prettier-ignore -->
<!-- This file is auto-generated with the remote-components-generator -->
<script lang="ts">
  import type { RemoteSegmentedControlElementProps } from "@mittwald/flow-remote-elements";
  import { RemoteSegmentedControlElement } from "@mittwald/flow-remote-elements";
  import { useRemoteElementSync } from "../lib/remoteElementSync.svelte.js";
  import type { FlowRemoteProps } from "../lib/types.js";

  let { children, ...props }: FlowRemoteProps<RemoteSegmentedControlElementProps> = $props();

  // svelte-ignore state_referenced_locally
  const element = useRemoteElementSync(
    { tag: "flr-segmented-control", name: "SegmentedControl", element: RemoteSegmentedControlElement },
    () => props,
  );

  const hasContent = $derived(
    children !== undefined,
  );
</script>

{#if hasContent}<flr-segmented-control bind:this={element.node}>{@render children?.()}</flr-segmented-control>{:else}<flr-segmented-control bind:this={element.node}></flr-segmented-control>{/if}
