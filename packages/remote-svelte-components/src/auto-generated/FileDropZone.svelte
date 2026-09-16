<!-- prettier-ignore -->
<!-- This file is auto-generated with the remote-components-generator -->
<script lang="ts">
  import type { RemoteFileDropZoneElementProps } from "@mittwald/flow-remote-elements";
  import { RemoteFileDropZoneElement } from "@mittwald/flow-remote-elements";
  import { useRemoteElementSync } from "../lib/remoteElementSync.svelte.js";
  import type { FlowRemoteProps } from "../lib/types.js";

  let { children, ...props }: FlowRemoteProps<RemoteFileDropZoneElementProps> = $props();

  // svelte-ignore state_referenced_locally
  const element = useRemoteElementSync(
    { tag: "flr-file-drop-zone", name: "FileDropZone", element: RemoteFileDropZoneElement },
    () => props,
  );

  const hasContent = $derived(
    children !== undefined,
  );
</script>

{#if hasContent}<flr-file-drop-zone bind:this={element.node}>{@render children?.()}</flr-file-drop-zone>{:else}<flr-file-drop-zone bind:this={element.node}></flr-file-drop-zone>{/if}
