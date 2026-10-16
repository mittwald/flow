<!-- prettier-ignore -->
<!-- This file is auto-generated with the remote-components-generator -->
<script lang="ts">
  import type { RemoteInlineCodeElementProps } from "@mittwald/flow-remote-elements";
  import { RemoteInlineCodeElement } from "@mittwald/flow-remote-elements";
  import { useRemoteElementSync } from "../lib/remoteElementSync.svelte.js";
  import type { FlowRemoteProps } from "../lib/types.js";

  let { children, ...props }: FlowRemoteProps<RemoteInlineCodeElementProps> = $props();

  // svelte-ignore state_referenced_locally
  const element = useRemoteElementSync(
    { tag: "flr-inline-code", name: "InlineCode", element: RemoteInlineCodeElement },
    () => props,
  );

  const hasContent = $derived(
    children !== undefined,
  );
</script>

{#if hasContent}<flr-inline-code bind:this={element.node}>{@render children?.()}</flr-inline-code>{:else}<flr-inline-code bind:this={element.node}></flr-inline-code>{/if}
