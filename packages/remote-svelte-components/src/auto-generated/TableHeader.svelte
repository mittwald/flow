<!-- prettier-ignore -->
<!-- This file is auto-generated with the remote-components-generator -->
<script lang="ts">
  import type { RemoteTableHeaderElementProps } from "@mittwald/flow-remote-elements";
  import { RemoteTableHeaderElement } from "@mittwald/flow-remote-elements";
  import { useRemoteElementSync } from "../lib/remoteElementSync.svelte.js";
  import type { FlowRemoteProps } from "../lib/types.js";

  let { children, ...props }: FlowRemoteProps<RemoteTableHeaderElementProps> = $props();

  // svelte-ignore state_referenced_locally
  const element = useRemoteElementSync(
    { tag: "flr-table-header", name: "TableHeader", element: RemoteTableHeaderElement },
    () => props,
  );

  const hasContent = $derived(
    children !== undefined,
  );
</script>

{#if hasContent}<flr-table-header bind:this={element.node}>{@render children?.()}</flr-table-header>{:else}<flr-table-header bind:this={element.node}></flr-table-header>{/if}
