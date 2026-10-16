<!-- prettier-ignore -->
<!-- This file is auto-generated with the remote-components-generator -->
<script lang="ts">
  import type { RemoteSeparatorElementProps } from "@mittwald/flow-remote-elements";
  import { RemoteSeparatorElement } from "@mittwald/flow-remote-elements";
  import { useRemoteElementSync } from "../lib/remoteElementSync.svelte.js";
  import type { FlowRemoteProps } from "../lib/types.js";

  let { children, ...props }: FlowRemoteProps<RemoteSeparatorElementProps> = $props();

  // svelte-ignore state_referenced_locally
  const element = useRemoteElementSync(
    { tag: "flr-separator", name: "Separator", element: RemoteSeparatorElement },
    () => props,
  );

  const hasContent = $derived(
    children !== undefined,
  );
</script>

{#if hasContent}<flr-separator bind:this={element.node}>{@render children?.()}</flr-separator>{:else}<flr-separator bind:this={element.node}></flr-separator>{/if}
