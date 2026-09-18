<!-- prettier-ignore -->
<!-- This file is auto-generated with the remote-components-generator -->
<script lang="ts">
  import type { RemoteHeaderElementProps } from "@mittwald/flow-remote-elements";
  import { RemoteHeaderElement } from "@mittwald/flow-remote-elements";
  import { useRemoteElementSync } from "../lib/remoteElementSync.svelte.js";
  import type { FlowRemoteProps } from "../lib/types.js";

  let { children, ...props }: FlowRemoteProps<RemoteHeaderElementProps> = $props();

  // svelte-ignore state_referenced_locally
  const element = useRemoteElementSync(
    { tag: "flr-header", name: "Header", element: RemoteHeaderElement },
    () => props,
  );

  const hasContent = $derived(
    children !== undefined,
  );
</script>

{#if hasContent}<flr-header bind:this={element.node}>{@render children?.()}</flr-header>{:else}<flr-header bind:this={element.node}></flr-header>{/if}
