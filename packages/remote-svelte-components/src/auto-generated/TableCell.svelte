<!-- prettier-ignore -->
<!-- This file is auto-generated with the remote-components-generator -->
<script lang="ts">
  import type { RemoteTableCellElementProps } from "@mittwald/flow-remote-elements";
  import { RemoteTableCellElement } from "@mittwald/flow-remote-elements";
  import { useRemoteElementSync } from "../lib/remoteElementSync.svelte.js";
  import type { FlowRemoteProps } from "../lib/types.js";

  let { children, ...props }: FlowRemoteProps<RemoteTableCellElementProps> = $props();

  // svelte-ignore state_referenced_locally
  const element = useRemoteElementSync(
    { tag: "flr-table-cell", name: "TableCell", element: RemoteTableCellElement },
    () => props,
  );

  const hasContent = $derived(
    children !== undefined,
  );
</script>

{#if hasContent}<flr-table-cell bind:this={element.node}>{@render children?.()}</flr-table-cell>{:else}<flr-table-cell bind:this={element.node}></flr-table-cell>{/if}
