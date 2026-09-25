<!-- prettier-ignore -->
<!-- This file is auto-generated with the remote-components-generator -->
<script lang="ts">
  import type { RemoteCodeBlockElementProps } from "@mittwald/flow-remote-elements";
  import { RemoteCodeBlockElement } from "@mittwald/flow-remote-elements";
  import { useRemoteElementSync } from "../lib/remoteElementSync.svelte.js";
  import type { FlowRemoteProps } from "../lib/types.js";

  let { children, ...props }: FlowRemoteProps<RemoteCodeBlockElementProps> = $props();

  // svelte-ignore state_referenced_locally
  const element = useRemoteElementSync(
    { tag: "flr-code-block", name: "CodeBlock", element: RemoteCodeBlockElement },
    () => props,
  );

  const hasContent = $derived(
    children !== undefined,
  );
</script>

{#if hasContent}<flr-code-block bind:this={element.node}>{@render children?.()}</flr-code-block>{:else}<flr-code-block bind:this={element.node}></flr-code-block>{/if}
