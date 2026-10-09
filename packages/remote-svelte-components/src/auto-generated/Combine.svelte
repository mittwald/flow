<!-- prettier-ignore -->
<!-- This file is auto-generated with the remote-components-generator -->
<script lang="ts">
  import type { RemoteCombineElementProps } from "@mittwald/flow-remote-elements";
  import { RemoteCombineElement } from "@mittwald/flow-remote-elements";
  import { useRemoteElementSync } from "../lib/remoteElementSync.svelte.js";
  import type { FlowRemoteProps } from "../lib/types.js";

  let { children, ...props }: FlowRemoteProps<RemoteCombineElementProps> = $props();

  // svelte-ignore state_referenced_locally
  const element = useRemoteElementSync(
    { tag: "flr-combine", name: "Combine", element: RemoteCombineElement },
    () => props,
  );

  const hasContent = $derived(
    children !== undefined,
  );
</script>

{#if hasContent}<flr-combine bind:this={element.node}>{@render children?.()}</flr-combine>{:else}<flr-combine bind:this={element.node}></flr-combine>{/if}
