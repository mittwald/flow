<!-- prettier-ignore -->
<!-- This file is auto-generated with the remote-components-generator -->
<script lang="ts">
  import type { RemoteFileCardListElementProps } from "@mittwald/flow-remote-elements";
  import { RemoteFileCardListElement } from "@mittwald/flow-remote-elements";
  import { useRemoteElementSync } from "../lib/remoteElementSync.svelte.js";
  import type { FlowRemoteProps } from "../lib/types.js";

  let { children, ...props }: FlowRemoteProps<RemoteFileCardListElementProps> = $props();

  // svelte-ignore state_referenced_locally
  const element = useRemoteElementSync(
    { tag: "flr-file-card-list", name: "FileCardList", element: RemoteFileCardListElement },
    () => props,
  );

  const hasContent = $derived(
    children !== undefined,
  );
</script>

{#if hasContent}<flr-file-card-list bind:this={element.node}>{@render children?.()}</flr-file-card-list>{:else}<flr-file-card-list bind:this={element.node}></flr-file-card-list>{/if}
