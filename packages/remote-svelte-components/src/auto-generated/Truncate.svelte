<!-- prettier-ignore -->
<!-- This file is auto-generated with the remote-components-generator -->
<script lang="ts">
  import type { RemoteTruncateElementProps } from "@mittwald/flow-remote-elements";
  import { RemoteTruncateElement } from "@mittwald/flow-remote-elements";
  import { useRemoteElementSync } from "../lib/remoteElementSync.svelte.js";
  import type { FlowRemoteProps } from "../lib/types.js";

  let { children, ...props }: FlowRemoteProps<RemoteTruncateElementProps> = $props();

  // svelte-ignore state_referenced_locally
  const element = useRemoteElementSync(
    { tag: "flr-truncate", name: "Truncate", element: RemoteTruncateElement },
    () => props,
  );

  const hasContent = $derived(
    children !== undefined,
  );
</script>

{#if hasContent}<flr-truncate bind:this={element.node}>{@render children?.()}</flr-truncate>{:else}<flr-truncate bind:this={element.node}></flr-truncate>{/if}
