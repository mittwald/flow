<!-- prettier-ignore -->
<!-- This file is auto-generated with the remote-components-generator -->
<script lang="ts">
  import type { RemotePopoverContentElementProps } from "@mittwald/flow-remote-elements";
  import { RemotePopoverContentElement } from "@mittwald/flow-remote-elements";
  import { useRemoteElementSync } from "../lib/remoteElementSync.svelte.js";
  import type { FlowRemoteProps } from "../lib/types.js";

  let { children, ...props }: FlowRemoteProps<RemotePopoverContentElementProps> = $props();

  // svelte-ignore state_referenced_locally
  const element = useRemoteElementSync(
    { tag: "flr-popover-content", name: "PopoverContent", element: RemotePopoverContentElement },
    () => props,
  );

  const hasContent = $derived(
    children !== undefined,
  );
</script>

{#if hasContent}<flr-popover-content bind:this={element.node}>{@render children?.()}</flr-popover-content>{:else}<flr-popover-content bind:this={element.node}></flr-popover-content>{/if}
