<!-- prettier-ignore -->
<!-- This file is auto-generated with the remote-components-generator -->
<script lang="ts">
  import type { RemoteBigNumberElementProps } from "@mittwald/flow-remote-elements";
  import { RemoteBigNumberElement } from "@mittwald/flow-remote-elements";
  import { useRemoteElementSync } from "../lib/remoteElementSync.svelte.js";
  import type { FlowRemoteProps } from "../lib/types.js";

  let { children, ...props }: FlowRemoteProps<RemoteBigNumberElementProps> = $props();

  // svelte-ignore state_referenced_locally
  const element = useRemoteElementSync(
    { tag: "flr-big-number", name: "BigNumber", element: RemoteBigNumberElement },
    () => props,
  );

  const hasContent = $derived(
    children !== undefined,
  );
</script>

{#if hasContent}<flr-big-number bind:this={element.node}>{@render children?.()}</flr-big-number>{:else}<flr-big-number bind:this={element.node}></flr-big-number>{/if}
