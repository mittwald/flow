<!-- prettier-ignore -->
<!-- This file is auto-generated with the remote-components-generator -->
<script lang="ts">
  import type { RemoteCopyButtonElementProps } from "@mittwald/flow-remote-elements";
  import { RemoteCopyButtonElement } from "@mittwald/flow-remote-elements";
  import { useRemoteElementSync } from "../lib/remoteElementSync.svelte.js";
  import type { FlowRemoteProps } from "../lib/types.js";

  let { children, ...props }: FlowRemoteProps<RemoteCopyButtonElementProps> = $props();

  // svelte-ignore state_referenced_locally
  const element = useRemoteElementSync(
    { tag: "flr-copy-button", name: "CopyButton", element: RemoteCopyButtonElement },
    () => props,
  );

  const hasContent = $derived(
    children !== undefined,
  );
</script>

{#if hasContent}<flr-copy-button bind:this={element.node}>{@render children?.()}</flr-copy-button>{:else}<flr-copy-button bind:this={element.node}></flr-copy-button>{/if}
