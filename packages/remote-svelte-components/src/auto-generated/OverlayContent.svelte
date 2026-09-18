<!-- prettier-ignore -->
<!-- This file is auto-generated with the remote-components-generator -->
<script lang="ts">
  import type { RemoteOverlayContentElementProps } from "@mittwald/flow-remote-elements";
  import { RemoteOverlayContentElement } from "@mittwald/flow-remote-elements";
  import { useRemoteElementSync } from "../lib/remoteElementSync.svelte.js";
  import type { FlowRemoteProps } from "../lib/types.js";

  let { children, ...props }: FlowRemoteProps<RemoteOverlayContentElementProps> = $props();

  // svelte-ignore state_referenced_locally
  const element = useRemoteElementSync(
    { tag: "flr-overlay-content", name: "OverlayContent", element: RemoteOverlayContentElement },
    () => props,
  );

  const hasContent = $derived(
    children !== undefined,
  );
</script>

{#if hasContent}<flr-overlay-content bind:this={element.node}>{@render children?.()}</flr-overlay-content>{:else}<flr-overlay-content bind:this={element.node}></flr-overlay-content>{/if}
