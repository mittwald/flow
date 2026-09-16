<!-- prettier-ignore -->
<!-- This file is auto-generated with the remote-components-generator -->
<script lang="ts">
  import type { RemoteMessageSeparatorElementProps } from "@mittwald/flow-remote-elements";
  import { RemoteMessageSeparatorElement } from "@mittwald/flow-remote-elements";
  import { useRemoteElementSync } from "../lib/remoteElementSync.svelte.js";
  import type { FlowRemoteProps } from "../lib/types.js";

  let { children, ...props }: FlowRemoteProps<RemoteMessageSeparatorElementProps> = $props();

  // svelte-ignore state_referenced_locally
  const element = useRemoteElementSync(
    { tag: "flr-message-separator", name: "MessageSeparator", element: RemoteMessageSeparatorElement },
    () => props,
  );

  const hasContent = $derived(
    children !== undefined,
  );
</script>

{#if hasContent}<flr-message-separator bind:this={element.node}>{@render children?.()}</flr-message-separator>{:else}<flr-message-separator bind:this={element.node}></flr-message-separator>{/if}
