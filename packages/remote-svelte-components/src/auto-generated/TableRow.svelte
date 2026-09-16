<!-- prettier-ignore -->
<!-- This file is auto-generated with the remote-components-generator -->
<script lang="ts">
  import type { RemoteTableRowElementProps } from "@mittwald/flow-remote-elements";
  import { RemoteTableRowElement } from "@mittwald/flow-remote-elements";
  import { useRemoteElementSync } from "../lib/remoteElementSync.svelte.js";
  import type { FlowRemoteProps } from "../lib/types.js";

  let { children, ...props }: FlowRemoteProps<RemoteTableRowElementProps> = $props();

  // svelte-ignore state_referenced_locally
  const element = useRemoteElementSync(
    { tag: "flr-table-row", name: "TableRow", element: RemoteTableRowElement },
    () => props,
  );

  const hasContent = $derived(
    children !== undefined,
  );
</script>

{#if hasContent}<flr-table-row bind:this={element.node}>{@render children?.()}</flr-table-row>{:else}<flr-table-row bind:this={element.node}></flr-table-row>{/if}
