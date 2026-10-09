<!-- prettier-ignore -->
<!-- This file is auto-generated with the remote-components-generator -->
<script lang="ts">
  import type { RemoteMarkdownEditorElementProps } from "@mittwald/flow-remote-elements";
  import { RemoteMarkdownEditorElement } from "@mittwald/flow-remote-elements";
  import { useRemoteElementSync } from "../lib/remoteElementSync.svelte.js";
  import type { FlowRemoteProps } from "../lib/types.js";

  let { children, ...props }: FlowRemoteProps<RemoteMarkdownEditorElementProps> = $props();

  // svelte-ignore state_referenced_locally
  const element = useRemoteElementSync(
    { tag: "flr-markdown-editor", name: "MarkdownEditor", element: RemoteMarkdownEditorElement },
    () => props,
  );

  const hasContent = $derived(
    children !== undefined,
  );
</script>

{#if hasContent}<flr-markdown-editor bind:this={element.node}>{@render children?.()}</flr-markdown-editor>{:else}<flr-markdown-editor bind:this={element.node}></flr-markdown-editor>{/if}
