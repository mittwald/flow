<!-- prettier-ignore -->
<!-- This file is auto-generated with the remote-components-generator -->
<script lang="ts">
  import type { RemoteFileFieldElementProps } from "@mittwald/flow-remote-elements";
  import { RemoteFileFieldElement } from "@mittwald/flow-remote-elements";
  import { useRemoteElementSync } from "../lib/remoteElementSync.svelte.js";
  import type { FlowRemoteProps } from "../lib/types.js";

  let { children, ...props }: FlowRemoteProps<RemoteFileFieldElementProps> = $props();

  // svelte-ignore state_referenced_locally
  const element = useRemoteElementSync(
    { tag: "flr-file-field", name: "FileField", element: RemoteFileFieldElement },
    () => props,
  );

  const hasContent = $derived(
    children !== undefined,
  );
</script>

{#if hasContent}<flr-file-field bind:this={element.node}>{@render children?.()}</flr-file-field>{:else}<flr-file-field bind:this={element.node}></flr-file-field>{/if}
