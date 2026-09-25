<!-- prettier-ignore -->
<!-- This file is auto-generated with the remote-components-generator -->
<script lang="ts">
  import type { RemoteAlertTextElementProps } from "@mittwald/flow-remote-elements";
  import { RemoteAlertTextElement } from "@mittwald/flow-remote-elements";
  import { useRemoteElementSync } from "../lib/remoteElementSync.svelte.js";
  import type { FlowRemoteProps } from "../lib/types.js";

  let { children, ...props }: FlowRemoteProps<RemoteAlertTextElementProps> = $props();

  // svelte-ignore state_referenced_locally
  const element = useRemoteElementSync(
    { tag: "flr-alert-text", name: "AlertText", element: RemoteAlertTextElement },
    () => props,
  );

  const hasContent = $derived(
    children !== undefined,
  );
</script>

{#if hasContent}<flr-alert-text bind:this={element.node}>{@render children?.()}</flr-alert-text>{:else}<flr-alert-text bind:this={element.node}></flr-alert-text>{/if}
