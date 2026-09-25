<!-- prettier-ignore -->
<!-- This file is auto-generated with the remote-components-generator -->
<script lang="ts">
  import type { RemoteTableFooterRowElementProps } from "@mittwald/flow-remote-elements";
  import { RemoteTableFooterRowElement } from "@mittwald/flow-remote-elements";
  import { useRemoteElementSync } from "../lib/remoteElementSync.svelte.js";
  import type { FlowRemoteProps } from "../lib/types.js";

  let { children, ...props }: FlowRemoteProps<RemoteTableFooterRowElementProps> = $props();

  // svelte-ignore state_referenced_locally
  const element = useRemoteElementSync(
    { tag: "flr-table-footer-row", name: "TableFooterRow", element: RemoteTableFooterRowElement },
    () => props,
  );

  const hasContent = $derived(
    children !== undefined,
  );
</script>

{#if hasContent}<flr-table-footer-row bind:this={element.node}>{@render children?.()}</flr-table-footer-row>{:else}<flr-table-footer-row bind:this={element.node}></flr-table-footer-row>{/if}
