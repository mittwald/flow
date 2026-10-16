<!-- prettier-ignore -->
<!-- This file is auto-generated with the remote-components-generator -->
<script lang="ts">
  import type { RemoteTextAreaElementProps } from "@mittwald/flow-remote-elements";
  import { RemoteTextAreaElement } from "@mittwald/flow-remote-elements";
  import { useRemoteElementSync } from "../lib/remoteElementSync.svelte.js";
  import type { FlowRemoteProps } from "../lib/types.js";

  let { children, ...props }: FlowRemoteProps<RemoteTextAreaElementProps> = $props();

  // svelte-ignore state_referenced_locally
  const element = useRemoteElementSync(
    { tag: "flr-text-area", name: "TextArea", element: RemoteTextAreaElement },
    () => props,
  );

  const hasContent = $derived(
    children !== undefined,
  );
</script>

{#if hasContent}<flr-text-area bind:this={element.node}>{@render children?.()}</flr-text-area>{:else}<flr-text-area bind:this={element.node}></flr-text-area>{/if}
