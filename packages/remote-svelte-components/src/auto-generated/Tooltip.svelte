<!-- prettier-ignore -->
<!-- This file is auto-generated with the remote-components-generator -->
<script lang="ts">
  import type { RemoteTooltipElementProps } from "@mittwald/flow-remote-elements";
  import { RemoteTooltipElement } from "@mittwald/flow-remote-elements";
  import { useRemoteElementSync } from "../lib/remoteElementSync.svelte.js";
  import type { FlowRemoteProps } from "../lib/types.js";

  let { children, ...props }: FlowRemoteProps<RemoteTooltipElementProps> = $props();

  // svelte-ignore state_referenced_locally
  const element = useRemoteElementSync(
    { tag: "flr-tooltip", name: "Tooltip", element: RemoteTooltipElement },
    () => props,
  );

  const hasContent = $derived(
    children !== undefined,
  );
</script>

{#if hasContent}<flr-tooltip bind:this={element.node}>{@render children?.()}</flr-tooltip>{:else}<flr-tooltip bind:this={element.node}></flr-tooltip>{/if}
