<!-- prettier-ignore -->
<!-- This file is auto-generated with the remote-components-generator -->
<script lang="ts">
  import type { RemoteCounterBadgeElementProps } from "@mittwald/flow-remote-elements";
  import { RemoteCounterBadgeElement } from "@mittwald/flow-remote-elements";
  import { useRemoteElementSync } from "../lib/remoteElementSync.svelte.js";
  import type { FlowRemoteProps } from "../lib/types.js";

  let { children, ...props }: FlowRemoteProps<RemoteCounterBadgeElementProps> = $props();

  // svelte-ignore state_referenced_locally
  const element = useRemoteElementSync(
    { tag: "flr-counter-badge", name: "CounterBadge", element: RemoteCounterBadgeElement },
    () => props,
  );

  const hasContent = $derived(
    children !== undefined,
  );
</script>

{#if hasContent}<flr-counter-badge bind:this={element.node}>{@render children?.()}</flr-counter-badge>{:else}<flr-counter-badge bind:this={element.node}></flr-counter-badge>{/if}
