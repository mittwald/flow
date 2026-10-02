<!-- prettier-ignore -->
<!-- This file is auto-generated with the remote-components-generator -->
<script lang="ts">
  import type { RemoteCodeEditorElementProps } from "@mittwald/flow-remote-elements";
  import { RemoteCodeEditorElement } from "@mittwald/flow-remote-elements";
  import { useRemoteElementSync } from "../lib/remoteElementSync.svelte.js";
  import type { FlowRemoteProps } from "../lib/types.js";

  let { children, ...props }: FlowRemoteProps<RemoteCodeEditorElementProps> = $props();

  // svelte-ignore state_referenced_locally
  const element = useRemoteElementSync(
    { tag: "flr-code-editor", name: "CodeEditor", element: RemoteCodeEditorElement },
    () => props,
  );

  const hasContent = $derived(
    children !== undefined,
  );
</script>

{#if hasContent}<flr-code-editor bind:this={element.node}>{@render children?.()}</flr-code-editor>{:else}<flr-code-editor bind:this={element.node}></flr-code-editor>{/if}
