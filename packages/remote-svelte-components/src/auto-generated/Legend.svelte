<!-- prettier-ignore -->
<!-- This file is auto-generated with the remote-components-generator -->
<script lang="ts">
  import type { RemoteLegendElementProps } from "@mittwald/flow-remote-elements";
  import { RemoteLegendElement } from "@mittwald/flow-remote-elements";
  import { useRemoteElementSync } from "../lib/remoteElementSync.svelte.js";
  import type { FlowRemoteProps } from "../lib/types.js";

  let { children, ...props }: FlowRemoteProps<RemoteLegendElementProps> = $props();

  // svelte-ignore state_referenced_locally
  const element = useRemoteElementSync(
    { tag: "flr-legend", name: "Legend", element: RemoteLegendElement },
    () => props,
  );

  const hasContent = $derived(
    children !== undefined,
  );
</script>

{#if hasContent}<flr-legend bind:this={element.node}>{@render children?.()}</flr-legend>{:else}<flr-legend bind:this={element.node}></flr-legend>{/if}
