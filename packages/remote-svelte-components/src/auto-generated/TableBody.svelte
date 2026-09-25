<!-- prettier-ignore -->
<!-- This file is auto-generated with the remote-components-generator -->
<script lang="ts">
  import type { RemoteTableBodyElementProps } from "@mittwald/flow-remote-elements";
  import { RemoteTableBodyElement } from "@mittwald/flow-remote-elements";
  import { useRemoteElementSync } from "../lib/remoteElementSync.svelte.js";
  import type { FlowRemoteProps } from "../lib/types.js";

  let { children, ...props }: FlowRemoteProps<RemoteTableBodyElementProps> = $props();

  // svelte-ignore state_referenced_locally
  const element = useRemoteElementSync(
    { tag: "flr-table-body", name: "TableBody", element: RemoteTableBodyElement },
    () => props,
  );

  const hasContent = $derived(
    children !== undefined,
  );
</script>

{#if hasContent}<flr-table-body bind:this={element.node}>{@render children?.()}</flr-table-body>{:else}<flr-table-body bind:this={element.node}></flr-table-body>{/if}
