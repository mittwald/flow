<!-- prettier-ignore -->
<!-- This file is auto-generated with the remote-components-generator -->
<script lang="ts">
  import type { RemoteFileCardElementProps } from "@mittwald/flow-remote-elements";
  import { RemoteFileCardElement } from "@mittwald/flow-remote-elements";
  import { useRemoteElementSync } from "../lib/remoteElementSync.svelte.js";
  import type { FlowRemoteProps } from "../lib/types.js";

  let { children, ...props }: FlowRemoteProps<RemoteFileCardElementProps> = $props();

  // svelte-ignore state_referenced_locally
  const element = useRemoteElementSync(
    { tag: "flr-file-card", name: "FileCard", element: RemoteFileCardElement },
    () => props,
  );

  const hasContent = $derived(
    children !== undefined,
  );
</script>

{#if hasContent}<flr-file-card bind:this={element.node}>{@render children?.()}</flr-file-card>{:else}<flr-file-card bind:this={element.node}></flr-file-card>{/if}
