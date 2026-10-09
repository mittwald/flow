<!-- prettier-ignore -->
<!-- This file is auto-generated with the remote-components-generator -->
<script lang="ts">
  import type { RemoteColumnLayoutElementProps } from "@mittwald/flow-remote-elements";
  import { RemoteColumnLayoutElement } from "@mittwald/flow-remote-elements";
  import { useRemoteElementSync } from "../lib/remoteElementSync.svelte.js";
  import type { FlowRemoteProps } from "../lib/types.js";

  let { children, ...props }: FlowRemoteProps<RemoteColumnLayoutElementProps> = $props();

  // svelte-ignore state_referenced_locally
  const element = useRemoteElementSync(
    { tag: "flr-column-layout", name: "ColumnLayout", element: RemoteColumnLayoutElement },
    () => props,
  );

  const hasContent = $derived(
    children !== undefined,
  );
</script>

{#if hasContent}<flr-column-layout bind:this={element.node}>{@render children?.()}</flr-column-layout>{:else}<flr-column-layout bind:this={element.node}></flr-column-layout>{/if}
