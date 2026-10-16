<!-- prettier-ignore -->
<!-- This file is auto-generated with the remote-components-generator -->
<script lang="ts">
  import type { RemoteMessageElementProps } from "@mittwald/flow-remote-elements";
  import { RemoteMessageElement } from "@mittwald/flow-remote-elements";
  import { useRemoteElementSync } from "../lib/remoteElementSync.svelte.js";
  import type { FlowRemoteProps } from "../lib/types.js";

  let { children, ...props }: FlowRemoteProps<RemoteMessageElementProps> = $props();

  // svelte-ignore state_referenced_locally
  const element = useRemoteElementSync(
    { tag: "flr-message", name: "Message", element: RemoteMessageElement },
    () => props,
  );

  const hasContent = $derived(
    children !== undefined,
  );
</script>

{#if hasContent}<flr-message bind:this={element.node}>{@render children?.()}</flr-message>{:else}<flr-message bind:this={element.node}></flr-message>{/if}
