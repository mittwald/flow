<!-- prettier-ignore -->
<!-- This file is auto-generated with the remote-components-generator -->
<script lang="ts">
  import type { RemoteMarkdownElementProps } from "@mittwald/flow-remote-elements";
  import { RemoteMarkdownElement } from "@mittwald/flow-remote-elements";
  import { useRemoteElementSync } from "../lib/remoteElementSync.svelte.js";
  import type { FlowRemoteProps } from "../lib/types.js";

  let { children, ...props }: FlowRemoteProps<RemoteMarkdownElementProps> = $props();

  // svelte-ignore state_referenced_locally
  const element = useRemoteElementSync(
    { tag: "flr-markdown", name: "Markdown", element: RemoteMarkdownElement },
    () => props,
  );

  const hasContent = $derived(
    children !== undefined,
  );
</script>

{#if hasContent}<flr-markdown bind:this={element.node}>{@render children?.()}</flr-markdown>{:else}<flr-markdown bind:this={element.node}></flr-markdown>{/if}
