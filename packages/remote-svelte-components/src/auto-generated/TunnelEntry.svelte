<!-- prettier-ignore -->
<!-- This file is auto-generated with the remote-components-generator -->
<script lang="ts">
  import type { RemoteTunnelEntryElementProps } from "@mittwald/flow-remote-elements";
  import { RemoteTunnelEntryElement } from "@mittwald/flow-remote-elements";
  import { useRemoteElementSync } from "../lib/remoteElementSync.svelte.js";
  import type { FlowRemoteProps } from "../lib/types.js";

  let { children, ...props }: FlowRemoteProps<RemoteTunnelEntryElementProps> = $props();

  // svelte-ignore state_referenced_locally
  const element = useRemoteElementSync(
    { tag: "flr-tunnel-entry", name: "TunnelEntry", element: RemoteTunnelEntryElement },
    () => props,
  );

  const hasContent = $derived(
    children !== undefined,
  );
</script>

{#if hasContent}<flr-tunnel-entry bind:this={element.node}>{@render children?.()}</flr-tunnel-entry>{:else}<flr-tunnel-entry bind:this={element.node}></flr-tunnel-entry>{/if}
