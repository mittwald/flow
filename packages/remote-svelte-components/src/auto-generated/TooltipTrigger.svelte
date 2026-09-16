<!-- prettier-ignore -->
<!-- This file is auto-generated with the remote-components-generator -->
<script lang="ts">
  import type { RemoteTooltipTriggerElementProps } from "@mittwald/flow-remote-elements";
  import { RemoteTooltipTriggerElement } from "@mittwald/flow-remote-elements";
  import { useRemoteElementSync } from "../lib/remoteElementSync.svelte.js";
  import type { FlowRemoteProps } from "../lib/types.js";

  let { children, ...props }: FlowRemoteProps<RemoteTooltipTriggerElementProps> = $props();

  // svelte-ignore state_referenced_locally
  const element = useRemoteElementSync(
    { tag: "flr-tooltip-trigger", name: "TooltipTrigger", element: RemoteTooltipTriggerElement },
    () => props,
  );

  const hasContent = $derived(
    children !== undefined,
  );
</script>

{#if hasContent}<flr-tooltip-trigger bind:this={element.node}>{@render children?.()}</flr-tooltip-trigger>{:else}<flr-tooltip-trigger bind:this={element.node}></flr-tooltip-trigger>{/if}
