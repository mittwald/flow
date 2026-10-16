<!-- prettier-ignore -->
<!-- This file is auto-generated with the remote-components-generator -->
<script lang="ts">
  import type { RemoteBadgeElementProps } from "@mittwald/flow-remote-elements";
  import { RemoteBadgeElement } from "@mittwald/flow-remote-elements";
  import { useRemoteElementSync } from "../lib/remoteElementSync.svelte.js";
  import type { FlowRemoteProps } from "../lib/types.js";

  let { children, ...props }: FlowRemoteProps<RemoteBadgeElementProps> = $props();

  // svelte-ignore state_referenced_locally
  const element = useRemoteElementSync(
    { tag: "flr-badge", name: "Badge", element: RemoteBadgeElement },
    () => props,
  );

  const hasContent = $derived(
    children !== undefined,
  );
</script>

{#if hasContent}<flr-badge bind:this={element.node}>{@render children?.()}</flr-badge>{:else}<flr-badge bind:this={element.node}></flr-badge>{/if}
