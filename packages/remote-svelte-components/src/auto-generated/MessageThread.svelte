<!-- prettier-ignore -->
<!-- This file is auto-generated with the remote-components-generator -->
<script lang="ts">
  import type { RemoteMessageThreadElementProps } from "@mittwald/flow-remote-elements";
  import { RemoteMessageThreadElement } from "@mittwald/flow-remote-elements";
  import { useRemoteElementSync } from "../lib/remoteElementSync.svelte.js";
  import type { FlowRemoteProps } from "../lib/types.js";

  let { children, ...props }: FlowRemoteProps<RemoteMessageThreadElementProps> = $props();

  // svelte-ignore state_referenced_locally
  const element = useRemoteElementSync(
    { tag: "flr-message-thread", name: "MessageThread", element: RemoteMessageThreadElement },
    () => props,
  );

  const hasContent = $derived(
    children !== undefined,
  );
</script>

{#if hasContent}<flr-message-thread bind:this={element.node}>{@render children?.()}</flr-message-thread>{:else}<flr-message-thread bind:this={element.node}></flr-message-thread>{/if}
