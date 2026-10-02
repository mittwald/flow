<!-- prettier-ignore -->
<!-- This file is auto-generated with the remote-components-generator -->
<script lang="ts">
  import type { RemoteTableColumnElementProps } from "@mittwald/flow-remote-elements";
  import { RemoteTableColumnElement } from "@mittwald/flow-remote-elements";
  import { useRemoteElementSync } from "../lib/remoteElementSync.svelte.js";
  import type { FlowRemoteProps } from "../lib/types.js";

  let { children, ...props }: FlowRemoteProps<RemoteTableColumnElementProps> = $props();

  // svelte-ignore state_referenced_locally
  const element = useRemoteElementSync(
    { tag: "flr-table-column", name: "TableColumn", element: RemoteTableColumnElement },
    () => props,
  );

  const hasContent = $derived(
    children !== undefined,
  );
</script>

{#if hasContent}<flr-table-column bind:this={element.node}>{@render children?.()}</flr-table-column>{:else}<flr-table-column bind:this={element.node}></flr-table-column>{/if}
